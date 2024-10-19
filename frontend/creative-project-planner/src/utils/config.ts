interface DeveloperConfig {
    name: string;
    logo: string;
    website: string;
    github: string;
    email: string;
    phone: string;
    address: string;
}

interface AppConfig {
    name: string;
    version: string;
    api: string;
    email: string;
    currency: string;
    developer: DeveloperConfig;
}

function getConfig(defaults: Partial<AppConfig> = {}): AppConfig {
    const env = {
        VITE_APP_NAME: 'Creative-Project-Planner',
        VITE_APP_VERSION: '0.0.1',
        VITE_APP_API: 'localhost:3000',
        VITE_APP_EMAIL: 'support@gmail.com',
        VITE_APP_CURRENCY: 'MWK',
        VITE_APP_DEVELOPER_NAME: 'Ian Katengeza',
        VITE_APP_DEVELOPER_LOGO: 'https://umodzisource.com/images/logo.png',
        VITE_APP_DEVELOPER_WEBSITE: '',
        VITE_APP_DEVELOPER_GITHUB: '',
        VITE_APP_DEVELOPER_EMAIL: 'iankatengeza@gmail.com',
        VITE_APP_DEVELOPER_PHONE: '+265986101535',
        VITE_APP_DEVELOPER_ADDRESS: 'Area 12'
    };

    const config: AppConfig = {
        name: env.VITE_APP_NAME,
        version: env.VITE_APP_VERSION,
        api: env.VITE_APP_API,
        email: env.VITE_APP_EMAIL,
        currency: env.VITE_APP_CURRENCY,
        developer: {
            name: env.VITE_APP_DEVELOPER_NAME,
            logo: env.VITE_APP_DEVELOPER_LOGO,
            website: env.VITE_APP_DEVELOPER_WEBSITE,
            github: env.VITE_APP_DEVELOPER_GITHUB,
            email: env.VITE_APP_DEVELOPER_EMAIL,
            phone: env.VITE_APP_DEVELOPER_PHONE,
            address: env.VITE_APP_DEVELOPER_ADDRESS
        }
    };

    return { ...config, ...defaults };
}

const Config = getConfig();

export default Config;
