import LoginForm from "../../components/loginForm/LoginForm";
import { useTranslation } from "react-i18next";

const Login = () => {

	const [t, i18n] = useTranslation()

	return (
		<>
			<h1>{t('Acceso')}</h1>
			<LoginForm></LoginForm>
		</>
	);
};

export default Login;
