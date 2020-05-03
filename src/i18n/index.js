import Polyglot from './polyglot'
import ZHCN from './zh-CN'
import EN from './en'
const i18nMap = {
    'zh': ZHCN,
    'zh-CN': ZHCN,
    'en': EN,
}

export default function (language) {
    return new Polyglot({
        phrases: i18nMap[language] || i18nMap['zh-CN'],
        locale: language,
        onMissingKey: key => key
    })
}