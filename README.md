# FUTURE SPECIES — FUTURE PLAN

基于 Three.js 的复古未来主义 Web 3D 交互装置。包含 12 块独立 CRT 屏幕、透明机箱与内部电子结构、完整支架和落地线束、郁金香高脚椅、缩短的透明弧形操作台、配套桌面控制台、顶部摄像头，以及手机 / iPad 实时触控台。

## 运行要求

- 推荐 Node.js 22 与最新稳定版 npm。
- macOS 桌面端 Chrome 或 Safari，需支持 WebGL 2 并开启硬件加速。
- 摄像头需要用户授权，以及 `localhost` 或 HTTPS 安全上下文。

## 安装与启动

```bash
cd "outputs/Future Plan"
npm ci
npm run dev
```

开发服务监听 `0.0.0.0:5173`：

- 主场景：`http://127.0.0.1:5173/`
- 移动触控台：`http://127.0.0.1:5173/controller.html`

首屏为内嵌关键样式的控制台 Loading，不依赖 JavaScript 下载 CSS。12 张屏幕纹理、场景结构、着色器和完整首帧准备完毕后才会进入主界面。

### 手机 / iPad 连接

1. 电脑和移动设备连接同一局域网。
2. 保持 `npm run dev` 运行。
3. 在移动设备打开 `http://<电脑的局域网 IP>:5173/controller.html`。
4. 主场景仍建议通过电脑上的 `127.0.0.1` 打开，以确保摄像头权限可用。

触控台通过 WebSocket 同步屏幕选择、视角、摇杆、触控板、旋钮、显示参数、上传内容、摄像头开关和画面反转。桌面控制台与移动触控台采用相同的三区布局。

## 构建与生产预览

```bash
npm test
npm run build
npm run preview
```

- 构建产物：`dist/`
- 主页面：`dist/index.html`
- 触控台：`dist/controller.html`
- 生产预览：`http://127.0.0.1:4173/`
- 预览触控台：`http://127.0.0.1:4173/controller.html`

`npm run preview` 包含 WebSocket 中继、布局保存接口和临时媒体传输接口。`ws` 仅用于开发/预览服务端，不进入 Three.js 浏览器渲染包。

### 静态部署

可将 `dist/` 部署到静态网站服务。主场景、默认内容和同浏览器 `BroadcastChannel` 控制可用，但跨设备触控、项目写盘和移动端媒体中继需要 `npm run dev` / `npm run preview`，或自行部署等效后端。正式公网部署应使用 HTTPS，并为 WebSocket 和媒体接口增加访问控制。

## 主场景操作

- 鼠标左键拖动：旋转；滚轮：缩放。
- 单击硬件：选择与编辑。
- 数字键 `1–7`：参考构图、正视、左视、右视、背视、俯视、座椅视角。
- `H`：隐藏 / 显示界面；`Esc`：取消选择。
- 角度：每轴均有滑块与度数直接输入。
- XYZ 位置：默认收起在屏幕的“高级”区域。
- “归位默认位置”：仅恢复当前硬件的位置和角度，不影响其他硬件或屏幕内容。
- “打开摄像头”：将实时画面显示在中央右侧的摄像头屏；再次点击关闭。
- “反转画面”：只水平镜像摄像头屏纹理，不旋转硬件。
- “保存到项目”：开发 / 预览服务下写入 `references/runtime-layout.json`。
- “导出 JSON”：导出当前完整布局；“导入 JSON”：恢复布局并校验数值。

布局同时保存在浏览器 `localStorage`。本地上传的图片和视频只在当前会话有效，刷新后恢复项目占位内容；摄像头不会自动启动。

## 十二屏统一配置

主要配置位于 `src/config.js`：

- `screens`：独立 ID、名称、位置、旋转、机箱尺寸、边框和占位纹理。
- `screenDesign`：机型与独立分辨率。
- `displayDefaults`：内容状态、亮度、饱和度、对比度、色调、扫描线和水平反转。
- `sceneSettings`：背景、雾、曝光、灯光、地面、颗粒与像素比上限。
- `views`：参考构图及六个辅助视角。

12 个内容通道为：

`upper_left`、`upper_center`、`upper_right`、`center_main`、`portrait_left`、`left.01–03`、`right.01–03`、`desk`。程序中的完整 ID 均带 `screen.` 前缀。

## 代码与资源结构

```text
index.html                 主页面与首屏 Loading
controller.html            手机 / iPad 触控台
public/textures/           12 张项目占位纹理
references/                最终参考图、校准数据、运行时布局
src/config.js              场景与十二屏统一配置
src/main.js                场景、相机、加载、渲染与公共 API
src/screens.js             CRT 机型、曲面显示表面与内部结构
src/cabinets.js            透明机箱与电子元件
src/camera-hardware.js     顶部双镜头摄像头
src/structure.js           弧形金属框架、座椅与固定线束
src/furniture.js           缩短的透明操作台
src/console-controller.js  桌面实体控制台
src/mounts.js              双端绑定支架、动态线缆与落地线束
src/materials.js           塑料、亚克力、玻璃、金属与电子材料
src/content-controller.js  内容替换、异步竞争与纹理释放
src/media.js               本地图片 / 视频解码
src/layout-store.js        布局校验与持久化
src/editor.js              硬件编辑面板
src/controller.js          移动触控台逻辑
src/remote-channel.js      开发、预览与同浏览器实时通道
src/data-bridge.js         外部交互数据接口
tests/                     内容、布局和数据接口回归测试
validation/                多角度与启动页浏览器截图
tools/                     原有参考图屏幕提取工具
```

## 内容接入 API

页面加载后可通过 `window.futurePlan` 使用：

```js
await window.futurePlan.ready;

// 图片、视频 URL、THREE.Texture、图片或 Canvas
await window.futurePlan.setScreenContent('screen.left.01', canvas);

// 独立显示参数
window.futurePlan.setScreenDisplay('screen.left.01', {
  brightness: 1.1,
  saturation: 0.85,
  contrast: 1.05,
  flip: false,
});

// 位置与弧度制旋转
window.futurePlan.setScreenTransform('screen.left.01', {
  position: [-3.75, 4.9, 1.1],
  rotation: [0, 0.22, 0],
});

window.futurePlan.restoreScreenContent('screen.left.01');
```

其他接口：`setView`、`select`、`contentDemo`、`toggleCamera`、`remoteControl`、`connectDataChannel`、`applyData`、`setUIVisible`、`capture`、`diagnostics`。

外部数据消息支持：

```json
{"screen":"screen.center_main","display":{"brightness":0.9}}
```

或 OSC 风格地址：

```json
{"address":"/screen/center_main/brightness","value":0.9}
```

OSC 本身需通过 OSC → WebSocket/JSON 桥接程序转换；项目不声称原生解码 OSC 二进制包。

## 已完成的验证

- `npm test`：内容异步加载、纹理生命周期、硬件布局、反转持久化和数据接口测试。
- `npm run build`：主场景与触控台多页面生产构建。
- 实际浏览器检查：正面、左右侧、背面、俯视、座椅视角、手机竖屏触控台与启动页。
- 实测移动控制：屏幕选择、空白、还原、旋钮参数同步与主场景状态回传。
- 生产服务检查：两个 HTML 入口和 WebSocket 中继。

最终截图：

- `validation/final-loading.png`
- `validation/final-reference.png`
- `validation/final-left.png`
- `validation/final-right.png`
- `validation/final-back.png`
- `validation/final-top.png`
- `validation/final-seat.png`
- `validation/final-controller.png`

## 尚未完成 / 后续开发

- 海洋、飞行和植物物种交互内容按需求暂不开发；当前保留占位纹理和实时 Canvas 示例。
- 摄像头调用与权限流程已实现；实际镜头画面仍需在授权设备上确认。当前自动化浏览器未提供可确认的摄像头实拍。
- 已在内置 Chrome 浏览器实测；Safari 的最终 GPU、透明排序和摄像头兼容性仍建议在目标设备上复核。
- 公网跨设备控制需要带 HTTPS 的正式中继与访问控制；纯静态托管不包含服务端能力。
- 后续可接入真实 OSC 硬件、长期媒体资源库、更多实时 Three.js 内容和正式部署配置。

原始可运行版本已保留在 Git 检查点 `db76890`。
