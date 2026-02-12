import asyncio
from playwright.async_api import async_playwright
import os

async def verify_ux():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Go to the login page (running on port 5173 via vite dev server, but we build it first)
        # Actually, let's just use the build output if possible?
        # Usually we run the dev server or preview.
        # For now, I'll trust the code change as it's simple, but I should try to run it.

        # Since I already ran build, I can try to run 'pnpm preview'
        print("Starting preview server...")
        process = await asyncio.create_subprocess_exec(
            "pnpm", "--prefix", "frontend", "preview", "--port", "5173",
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )

        await asyncio.sleep(3) # Wait for server to start

        try:
            await page.goto("http://localhost:5173/login")

            # 1. Verify initial password state
            password_input = page.locator('input[name="password"]')
            print(f"Initial type: {await password_input.get_attribute('type')}")

            # 2. Toggle password visibility
            toggle_button = page.locator('button[aria-label="Show password"]')
            await toggle_button.click()
            print(f"After click type: {await password_input.get_attribute('type')}")

            # 3. Toggle back
            toggle_button = page.locator('button[aria-label="Hide password"]')
            await toggle_button.click()
            print(f"After second click type: {await password_input.get_attribute('type')}")

            await page.screenshot(path="/home/jules/verification/password_toggle_final.png")

        finally:
            process.terminate()
            await browser.close()

if __name__ == "__main__":
    os.makedirs("/home/jules/verification", exist_ok=True)
    asyncio.run(verify_ux())
