import { useNavigate } from 'react-router-dom';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { errorAlert } from '../helpers/alert';
import { useAppDispatch } from '../store';
import { loginGoogle } from '../store/auth/authSlice.ts';

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleGoogleLogin = async ({ credential }: CredentialResponse) => {
    if (!credential) {
      errorAlert('Login Failed');
      return;
    }
    await dispatch(loginGoogle(credential));
    navigate('/');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-amber-100">
      <GoogleLogin
        onSuccess={response => handleGoogleLogin(response)}
        onError={() => {
          errorAlert('Login Failed');
        }}
      />
    </div>
  );
}
