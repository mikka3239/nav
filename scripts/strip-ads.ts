// 上游 start.ts 会把作者的带货横幅、推广轮播和组件位默认值重新写回 data/，
// 挂在 postinit 钩子上保证本地与 CI 每次构建后都是干净的。
import fs from 'fs'
import { PATHS } from './utils'
import type { IComponentProps, ISettings } from '../src/types/index'

// 4=图片组件 5=倒计时组件 9=轮播，默认内容都是作者 CDN 上的推广图
const PROMO_COMPONENT_TYPES = [4, 5, 9]
const PROMO_IMAGE_KEYS = [
  'lightImages',
  'superImages',
  'simThemeImages',
  'sideThemeImages',
] as const

const settings: ISettings = JSON.parse(fs.readFileSync(PATHS.settings, 'utf-8'))
for (const key of PROMO_IMAGE_KEYS) {
  settings[key] = []
}
settings.showGithub = false
fs.writeFileSync(PATHS.settings, JSON.stringify(settings), 'utf-8')

const component: IComponentProps = JSON.parse(
  fs.readFileSync(PATHS.component, 'utf-8'),
)
component.components = component.components.filter(
  (item) => !PROMO_COMPONENT_TYPES.includes(item.type),
)
fs.writeFileSync(PATHS.component, JSON.stringify(component), 'utf-8')

console.log(
  '广告位已清除：',
  PROMO_IMAGE_KEYS.join('/'),
  'showGithub=false',
  '组件位剩余',
  component.components.map((item) => item.type).join(','),
)
