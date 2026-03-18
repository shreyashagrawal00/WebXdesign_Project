            <button
              onClick={() => setIsRegister(!isRegister)}
              style={{ background: 'none', color: 'var(--primary)', fontWeight: 600, padding: 0 }}
            >
              {isRegister ? 'Sign In' : 'Register Now'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '0.75rem 1rem',
  borderRadius: '0.5rem',
  background: 'var(--glass-bg)',
  border: '1px solid var(--surface-border)',
  color: 'var(--text)',
  fontSize: '1rem',
  outline: 'none',
  transition: 'border-color 0.2s'
};

const iconStyle = {
  position: 'absolute',
  left: '0.75rem',
  top: '50%',
  transform: 'translateY(-50%)',
  color: 'var(--text-muted)'
};

export default Login;
