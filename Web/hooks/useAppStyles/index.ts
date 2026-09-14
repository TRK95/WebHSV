import appStyles from "./appConfigStyles.json";

const mode = process.env.NEXT_PUBLIC_MODE;

const useAppStyles = () => {
    const appStyle: any = appStyles[mode];
    const appStyleRules = Object.keys(appStyle || {}).map((key) => `--${key}:${appStyle[key]};`).join('');
    return `:root{${appStyleRules}}`;
}

export default useAppStyles;