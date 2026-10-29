# FUTURE SPECIES — FUTURE PLAN

基于 Three.js 的复古未来主义 Web 3D 交互装置。包含 12 块独立 CRT 屏幕、透明机箱与内部电子结构、完整支架和落地线束、郁金香高脚椅、缩短的透明弧形操作台、配套桌面控制台、顶部摄像头，以及手机 / iPad 实时触控台。

## 已上线

- 主场景：https://future-species.johnzhang569.workers.dev/
- 移动触控台：https://future-species.johnzhang569.workers.dev/controller.html
- 四路生命画面：https://future-species.johnzhang569.workers.dev/air.html
- AIR 专属控制器：https://future-species.johnzhang569.workers.dev/air-remote.html
- GitHub 源码：https://github.com/john007076/future-species

Cloudflare Workers 托管 `dist/` 静态资源，Durable Object 负责公网 WebSocket 中继、布局存储和临时媒体传输。`run_worker_first` 确保根路径的 WebSocket 升级不会被静态 `index.html` 接管。

本地更新并重新部署：

```bash
npm run deploy
git push
```

GitHub Actions 已放在 `.github/workflows/deploy.yml`。要启用推送后自动部署，需要在仓库 Settings → Secrets and variables → Actions 中配置 `CLOUDFLARE_API_TOKEN` 与 `CF_ACCOUNT_ID`；未配置时工作流会跳过部署。

线上媒体上传限制为单个文件 64 MB，并在约 30 分钟后过期。布局保存在共享 Durable Object 中。当前为公开演示：知道网址的人都能控制打开中的主场景；正式展览或私人使用前，应增加 Cloudflare Access 或控制 PIN。摄像头视频只在主场景浏览器本地使用，不经过 Cloudflare 中继。

已验证公网主页、触控台在线状态、跨页面屏幕选择，以及 Durable Object WebSocket 消息收发。

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

### AIR SPECIES / SP-01（本地实时版本）

点击以下任一屏幕，左侧打开 AIR SPECIES 面板，右侧继续保留硬件编辑。透明机箱后可见的显示面优先接收屏幕选择，避免机箱抢走点击。

| 真实屏幕 ID | 内容 |
| --- | --- |
| `screen.upper_left` | 主飞行场景 |
| `screen.portrait_left` | 同一生物的羽枝与身体微距 |
| `screen.left.02` | 气流、速度和信号 |
| `screen.left.03` | 最近 9 秒轨迹与位置残影 |

其余八屏的内容不变，包括中央右侧摄像头专用 `screen.desk`。原始纹理文件保留。

- XY Pad 使用 Pointer Events 与 pointer capture，X/Y 范围为 `[-1,1]`；上下改变飞行高度，左右改变位置。支持鼠标、触控板和触摸事件，也支持方向键与 Home。
- Motion Response 控制响应，Feather Dynamics 控制羽枝延迟和变形，Drift 控制自主漂移。松手后保留速度，约 3.2 秒内从滑行过渡到自主漂浮；失焦、隐藏界面或切换到其他屏幕会释放面板输入。
- Reset Flight 重置飞行状态、三项参数和轨迹，并恢复四块 AIR 屏的实时内容。硬件位置、角度、亮度和其他屏幕不受影响。
- 27 组曲线羽枝与次级纤维程序化生成身体；没有眼睛、鸟脸或机械部件。四个 CanvasTexture 直接接入原屏幕材质的 map/emissiveMap，微距使用同一帧生物的局部裁切。没有前景 DOM 生物图像。
- 生命模拟使用 120Hz 固定步长，四路纹理最多更新 30 次/秒；纹理最大为 640×552 / 384×960 / 384×452 / 384×456。轨迹采样为 20Hz、最多 180 点，页面后台暂停模拟。
- 右侧上传、空白、显示参数和角度编辑仍可使用；AIR 屏的“实时纹理”和“还原内容”恢复该屏的 AIR 内容。已保存的空白状态在刷新后保留。

实现文件：`src/air-species-state.js`、`src/air-species-views.js`、`src/air-species-panel.js`、`src/air-species.css`；`src/main.js` 负责接入，`src/config.js` 仅更新四屏内容标签。

### 双触控板 / Morph Field 更新（2026-10-30）

- 第一块 **FLIGHT FIELD** 控制全局飞行位置和高度；第二块 **MORPH FIELD** 控制身体局部吸附位置。按住产生吸附，移动带动涡旋与延迟，松开后约 4–6 秒逐渐消散。两路输入独立，支持多触点分别操作（真实双指设备仍待验证）。
- **Attraction** 调节吸附强度，**Fluidity** 调节流动性、回弹与耗散；原 Motion Response、Feather Dynamics、Drift 位于 **Flight Tuning**。
- 三个相互融合的标量场波瓣生成半透明薄膜，并作用于真实羽枝曲线的位置、卷曲和深度；身体的呼吸、扭转和前后层次也增强。它是用于实时视觉的场形变，不是不可压缩流体求解器。
- 四路仍共用同一生命与形态状态，气流屏同时显示吸附与涡旋变化。`src/air-species-field.js` 提供共享场函数，`tests/air-species-field.test.js` 检查密度连续性、局部变形与旋向。
- 输入接口新增 `air.setFieldInput({x:0.3,y:0.2,source:'leap'})` 和 `air.releaseFieldInput()`。隐藏界面、切换非 AIR 屏幕和 Reset 会释放面板捕获；页面后台释放两路外部输入。

预留手部追踪适配接口（未接入真实 Leap Motion 设备）：

```js
await window.futurePlan.ready;
const air = window.futurePlan.airSpecies;
air.setInput({x: 0.4, y: 0.7, active: true, source: 'leap'});
// 手离开追踪范围时释放，保留惯性。
air.releaseInput();
air.setParameters({response: 0.45, feather: 0.65, drift: 0.5});
air.snapshot();
air.diagnostics();
await air.reset();
```

本地验证：`npm test` 包含 AIR 的位移、阻尼、释放、羽毛响应、帧率一致性、输入校验和重置测试。开发服务下访问 `/tests/air-species-browser.html` 可检查真实 Canvas 四路响应、纹理尺寸、释放和绘制耗时。该诊断页不包含在生产入口中，不能把它的 Canvas 绘制耗时当作整套 3D 装置的帧率。

本轮已完成桌面浏览器的十二屏点击归属、XY 拖动、滑行恢复、参数重置、空白刷新/还原，以及窄屏可滚动布局检查。四个 AIR 屏幕的控制面板均提供“进入四路生命画面”按钮。Safari、真实触摸设备、真实摄像头和 Leap Motion 尚未验证；视觉形态仍需作者审阅。

### AIR Living Canvas / AIR Remote（独立轻量页面）

- `air.html`：同时显示全景、纤维微距、气流和轨迹四路实时画面。同一个生命状态驱动四张 Canvas 持续运动，不是静态图；不创建完整 CRT 场景，也不加载其余 11 屏和硬件渲染。
- `air-remote.html`：专用双触控板遥控页，服务于四路页面及现有四屏 AIR。remote 本身不运行 3D 或第二套生命模拟，只发送输入并显示实时状态回传。
- 四路页面中直接拖动任一画面控制飞行，Shift + 拖动控制形态；触摸设备第一根手指控制飞行，第二根手指控制形态。
- 渲染使用四张 2D Canvas，不创建 WebGL renderer。桌面最多 30 FPS，触摸设备最多 24 FPS；纹理分辨率保持固定，后台暂停模拟。
- 总控制器 `controller.html` 的 SPECIAL MODE 提供 AIR VIEWS / AIR REMOTE 入口。AIR VIEWS 发送 `openAirViews` 指令，让主 Web 自己切换到四路画面，总控页面保持不跳转；同时暂停完整装置的 Three.js 与其他内容渲染，返回总控时恢复。
- 专属 remote 与总控统一使用浅灰机壳、黑色按键、橙色播放态、带孔触控板和金属旋钮。五个 AIR 参数旋钮及总控旋钮均支持拖动、键盘和点击数字直接输入。
- DISPLAY SELECT 的 `01–04` 可独立播放/暂停四路，另有 ALL ON / ALL OFF。关闭的画面停止绘制并保留最后一帧和 PAUSED 标记，生命模拟继续，重新打开时与当前状态同步。
- 飞行与形态相位使用连续时间，不再在 `2π` 处强制取模，避免非整数频率动画产生头尾跳变。跨周期连续性已加入回归测试。
- `air-remote-protocol.js` 统一飞行、形态、参数、重置和状态请求消息。状态回传最多 10Hz，并省略轨迹数组以降低流量。开发、预览及 Cloudflare Durable Object 使用同一中继协议。
- 已实测桌面拖动、remote 飞行与吸附、手机竖屏布局和模拟触摸拖动；真实双指硬件与 Safari 仍需最终设备复核。

本地地址：

```text
http://192.168.1.4:5173/air.html
http://192.168.1.4:5173/air-remote.html
```

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

- AIR 飞行四屏已在本地接入实时交互；海洋和植物屏幕继续保留原占位内容。
- 摄像头调用与权限流程已实现；实际镜头画面仍需在授权设备上确认。当前自动化浏览器未提供可确认的摄像头实拍。
- 已在内置 Chrome 浏览器实测；Safari 的最终 GPU、透明排序和摄像头兼容性仍建议在目标设备上复核。
- 公网跨设备控制需要带 HTTPS 的正式中继与访问控制；纯静态托管不包含服务端能力。
- 后续可接入真实 OSC 硬件、长期媒体资源库、更多实时 Three.js 内容和正式部署配置。

原始可运行版本已保留在 Git 检查点 `db76890`。
