import './air-species.css';

const CHANNELS = {
  'screen.upper_left': '01 / FLIGHT',
  'screen.portrait_left': '02 / FIBRE',
  'screen.left.02': '03 / AIRFLOW',
  'screen.left.03': '04 / TRACE',
};
const BEHAVIOURS = {floating: '自主漂浮', responding: '跟随气流', gliding: '惯性滑行'};
const FIELD_BEHAVIOURS = {resting: '等待触碰', attracting: '吸附与流动', relaxing: '余流回弹'};
const clamp = value => Math.max(-1, Math.min(1, value));
const signed = value => (value >= 0 ? '+' : '−') + Math.abs(value).toFixed(2);

export function createAirSpeciesPanel({flight, onReset}) {
  const element = document.createElement('aside');
  element.id = 'air-species-panel';
  element.hidden = true;
  element.setAttribute('aria-label', 'AIR SPECIES 飞行与形态控制');
  element.innerHTML = `
    <header class="air-heading">
      <div><small>LIVING STUDY / SP–01</small><h2>AIR SPECIES</h2></div>
      <span class="air-indicator" aria-hidden="true"></span>
    </header>
    <div class="air-channel"><span>FOUR LINKED VIEWS</span><strong data-air-channel></strong></div>
    <a class="air-open-focus" href="./air.html">进入四路生命画面 <span aria-hidden="true">↗</span></a>
    <div class="air-pad-heading"><span>FLIGHT FIELD</span><span>位置与高度</span></div>
    <div class="air-xy-pad" data-air-pad="flight" tabindex="0" role="group" aria-label="二维飞行控制，左右改变位置，上下改变高度" aria-describedby="air-pad-help">
      <span class="air-axis air-axis-x" aria-hidden="true"></span><span class="air-axis air-axis-y" aria-hidden="true"></span>
      <span class="air-pad-label air-pad-top" aria-hidden="true">RISE</span><span class="air-pad-label air-pad-bottom" aria-hidden="true">DESCEND</span>
      <span class="air-pad-position" aria-hidden="true"></span><span class="air-pad-target" aria-hidden="true"></span>
    </div>
    <div class="air-coordinates"><span>X <output data-air-x>+0.00</output></span><span>Y <output data-air-y>+0.00</output></span><span data-air-behaviour>自主漂浮</span></div>
    <div class="air-pad-heading air-morph-heading"><span>MORPH FIELD</span><span>吸附与流动</span></div>
    <div class="air-xy-pad air-field-pad" data-air-pad="field" tabindex="0" role="group" aria-label="形态触控板，移动吸附场影响羽枝和流体" aria-describedby="air-field-help air-pad-help">
      <span class="air-axis air-axis-x" aria-hidden="true"></span><span class="air-axis air-axis-y" aria-hidden="true"></span>
      <span class="air-field-influence" aria-hidden="true"></span>
      <span class="air-pad-position" aria-hidden="true"></span><span class="air-pad-target" aria-hidden="true"></span>
    </div>
    <div class="air-field-meta"><span data-air-field-status>等待触碰</span><span>吸附 <output data-air-field-strength>0%</output></span></div>
    <p id="air-field-help">按住聚拢羽枝 · 拖动牵引 · 松开回弹</p>
    <p id="air-pad-help" class="air-sr-only">两个触控板可独立拖动或同时触摸。方向键微调当前触控板，Home 回到中心。第一块控制飞行，第二块控制身体内的吸附场。</p>
    <div class="air-parameters air-morph-parameters">
      <label><span>Attraction <small>吸附强度</small></span><output data-air-value="attraction"></output><input type="range" min="0" max="1" step="0.01" data-air-param="attraction" aria-label="Attraction 吸附强度"/></label>
      <label><span>Fluidity <small>流动性</small></span><output data-air-value="fluidity"></output><input type="range" min="0" max="1" step="0.01" data-air-param="fluidity" aria-label="Fluidity 流动性"/></label>
    </div>
    <details class="air-flight-tuning"><summary>Flight Tuning <span>飞行参数</span></summary>
      <div class="air-parameters">
        <label><span>Motion Response</span><output data-air-value="response"></output><input type="range" min="0" max="1" step="0.01" data-air-param="response" aria-label="Motion Response 飞行响应"/></label>
        <label><span>Feather Dynamics</span><output data-air-value="feather"></output><input type="range" min="0" max="1" step="0.01" data-air-param="feather" aria-label="Feather Dynamics 羽毛动态"/></label>
        <label><span>Drift</span><output data-air-value="drift"></output><input type="range" min="0" max="1" step="0.01" data-air-param="drift" aria-label="Drift 自主漂移"/></label>
      </div>
      <div class="air-speed">FLIGHT SPEED <output data-air-speed>0.00</output></div>
    </details>
    <button type="button" class="air-reset">Reset Flight <span aria-hidden="true">↺</span></button>
  `;
  document.body.append(element);
  element.querySelectorAll('output').forEach(output => output.setAttribute('aria-live', 'off'));
  const channel = element.querySelector('[data-air-channel]');
  const behaviour = element.querySelector('[data-air-behaviour]');
  const xValue = element.querySelector('[data-air-x]');
  const yValue = element.querySelector('[data-air-y]');
  const speedValue = element.querySelector('[data-air-speed]');
  const fieldStatus = element.querySelector('[data-air-field-status]');
  const fieldStrength = element.querySelector('[data-air-field-strength]');
  const fieldInfluence = element.querySelector('.air-field-influence');
  const parameters = [...element.querySelectorAll('[data-air-param]')];
  const parameterValues = Object.fromEntries([...element.querySelectorAll('[data-air-value]')].map(output => [output.dataset.airValue, output]));
  const events = new AbortController();
  const listen = (node, type, handler, options = {}) => node.addEventListener(type, handler, {...options, signal: events.signal});
  let currentMode = null;
  let lastUpdate = -Infinity;

  function bindPad(name, getState, setInput, releaseInput) {
    const pad = element.querySelector(`[data-air-pad="${name}"]`);
    const targetDot = pad.querySelector('.air-pad-target');
    const positionDot = pad.querySelector('.air-pad-position');
    let pointerId = null, keyboardActive = false;
    const pressedKeys = new Set();

    function finish() {
      const captured = pointerId, wasActive = pointerId !== null || keyboardActive;
      pointerId = null;
      keyboardActive = false;
      pressedKeys.clear();
      pad.classList.remove('is-active');
      if (captured !== null && pad.hasPointerCapture(captured)) pad.releasePointerCapture(captured);
      if (wasActive) releaseInput();
    }

    function movePointer(event) {
      const rect = pad.getBoundingClientRect();
      setInput({x: clamp((event.clientX - rect.left - rect.width * .05) / (rect.width * .9) * 2 - 1), y: clamp(1 - (event.clientY - rect.top - rect.height * .05) / (rect.height * .9) * 2), active: true, source: 'pointer'});
      update(flight.state, true);
    }

    listen(pad, 'pointerdown', event => {
      if (pointerId !== null || (event.pointerType === 'mouse' && event.button !== 0)) return;
      event.preventDefault();
      finish();
      pointerId = event.pointerId;
      // Focusing a second touch surface must not cancel the first finger.
      if (event.pointerType !== 'touch') pad.focus({preventScroll: true});
      pad.setPointerCapture(pointerId);
      pad.classList.add('is-active');
      movePointer(event);
    });
    listen(pad, 'pointermove', event => {
      if (event.pointerId !== pointerId) return;
      event.preventDefault();
      movePointer(event);
    });
    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) {
      listen(pad, type, event => { if (event.pointerId === pointerId) finish(); });
    }
    listen(pad, 'keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home'].includes(event.key) || pointerId !== null) return;
      event.preventDefault();
      pressedKeys.add(event.key);
      const state = getState(), previous = keyboardActive ? state.input : state;
      let {x, y} = previous;
      const step = event.shiftKey ? .12 : .04;
      if (event.key === 'ArrowLeft') x -= step;
      if (event.key === 'ArrowRight') x += step;
      if (event.key === 'ArrowUp') y += step;
      if (event.key === 'ArrowDown') y -= step;
      if (event.key === 'Home') x = y = 0;
      keyboardActive = true;
      pad.classList.add('is-active');
      setInput({x: clamp(x), y: clamp(y), active: true, source: 'keyboard'});
      update(flight.state, true);
    });
    listen(pad, 'keyup', event => {
      pressedKeys.delete(event.key);
      if (keyboardActive && pressedKeys.size === 0) finish();
    });
    listen(pad, 'blur', () => { if (keyboardActive) finish(); });

    return {
      finish,
      update(state) {
        const target = state.input.active ? state.input : state.target;
        targetDot.style.left = `${50 + clamp(target.x) * 45}%`;
        targetDot.style.top = `${50 - clamp(target.y) * 45}%`;
        positionDot.style.left = `${50 + clamp(state.x) * 45}%`;
        positionDot.style.top = `${50 - clamp(state.y) * 45}%`;
      },
    };
  }

  const flightPad = bindPad('flight', () => flight.state, input => flight.setInput(input), () => flight.releaseInput());
  const fieldPad = bindPad('field', () => flight.state.field, input => flight.setFieldInput(input), () => flight.releaseFieldInput());
  function finishInputs() { flightPad.finish(); fieldPad.finish(); }
  listen(window, 'blur', finishInputs);
  listen(document, 'visibilitychange', () => { if (document.hidden) finishInputs(); });
  for (const type of ['pointerdown', 'pointermove', 'pointerup', 'pointercancel', 'click', 'dblclick', 'wheel', 'keydown', 'keyup']) {
    listen(element, type, event => {
      if ((type === 'keydown' || type === 'keyup') && event.key === 'Escape') return;
      event.stopPropagation();
    }, {passive: type === 'wheel'});
  }
  parameters.forEach(input => listen(input, 'input', () => {
    flight.setParameters({[input.dataset.airParam]: Number(input.value)});
    update(flight.state, true);
  }));
  listen(element.querySelector('.air-reset'), 'click', async event => {
    finishInputs();
    const button = event.currentTarget;
    button.disabled = true;
    try {
      if (onReset) await onReset();
      else flight.reset();
      update(flight.state, true);
    } catch {
      behaviour.textContent = '重置失败，请重试';
      currentMode = null;
    } finally { button.disabled = false; }
  });

  function show(id) {
    const visible = Object.hasOwn(CHANNELS, id);
    if (!visible) finishInputs();
    element.hidden = !visible;
    document.body.classList.toggle('air-species-open', visible);
    if (visible) {
      channel.textContent = CHANNELS[id];
      update(flight.state, true);
    }
  }

  function update(state, force = false) {
    if (element.hidden && !force) return;
    const now = performance.now();
    if (!force && now - lastUpdate < 60) return;
    lastUpdate = now;
    flightPad.update(state);
    xValue.textContent = signed(state.x);
    yValue.textContent = signed(state.y);
    speedValue.textContent = state.speed.toFixed(2);
    if (currentMode !== state.mode) {
      currentMode = state.mode;
      behaviour.textContent = BEHAVIOURS[state.mode] || state.mode;
      element.dataset.behaviour = state.mode;
    }
    const field = state.field;
    if (field) {
      fieldPad.update(field);
      fieldStatus.textContent = FIELD_BEHAVIOURS[field.mode] || field.mode;
      fieldStrength.textContent = `${Math.round(field.strength * 100)}%`;
      element.dataset.fieldBehaviour = field.mode;
      fieldInfluence.style.left = `${50 + clamp(field.x) * 45}%`;
      fieldInfluence.style.top = `${50 - clamp(field.y) * 45}%`;
      fieldInfluence.style.width = `${30 + field.strength * 35}px`;
      fieldInfluence.style.height = `${25 + field.strength * 30}px`;
      fieldInfluence.style.opacity = String(.2 + field.strength * .55);
      fieldInfluence.style.transform = `translate(-50%, -50%) rotate(${field.phase * 12 + field.swirl * 35}deg) scaleX(${1 + Math.min(field.energy, 1) * .35})`;
    }
    for (const input of parameters) {
      const value = state.params[input.dataset.airParam];
      if (!Number.isFinite(value)) continue;
      if (Number(input.value) !== value) input.value = value;
      parameterValues[input.dataset.airParam].textContent = `${Math.round(value * 100)}%`;
    }
  }

  function dispose() {
    finishInputs();
    events.abort();
    document.body.classList.remove('air-species-open');
    element.remove();
  }

  update(flight.state, true);
  return {element, show, update, dispose};
}
