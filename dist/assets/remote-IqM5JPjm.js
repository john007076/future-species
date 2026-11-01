import{$ as e,$n as t,A as n,An as r,At as i,B as a,C as o,Ct as s,Dn as c,Dt as l,E as u,Et as d,Fn as f,G as p,Gn as m,H as h,I as g,In as _,J as v,K as y,Kn as b,L as x,Ln as S,Mn as C,N as w,Nn as T,On as E,P as D,Pn as O,Q as k,Qn as A,S as j,St as M,T as ee,Tt as N,U as P,V as te,Vn as F,X as I,Xn as L,Y as ne,Yn as re,Z as ie,Zn as R,_t as ae,ar as z,at as oe,b as se,bn as B,bt as ce,ct as le,d as ue,dt as de,er as fe,et as pe,f as me,ft as he,g as V,gt as H,h as U,hn as ge,ht as W,i as G,ir as K,it as q,j as J,jt as Y,k as _e,l as ve,lt as ye,mt as be,n as xe,nr as Se,o as Ce,or as we,ot as X,p as Te,pt as Ee,qn as De,r as Oe,rr as ke,s as Ae,sr as Z,st as je,tr as Me,u as Ne,ut as Pe,v as Fe,vn as Ie,vt as Le,w as Re,wn as ze,wt as Be,x as Ve,xn as He,xt as Ue,y as We,yn as Ge,z as Ke,zn as qe}from"./three.core-CrWiH2rF.js";import{n as Je,r as Ye}from"./audio-aPLefTvP.js";import{t as Xe}from"./gestures-BUC8ZKtL.js";function Ze(){let e=null,t=!1,n=null,r=null;function i(t,a){n(t,a),r=e.requestAnimationFrame(i)}return{start:function(){t!==!0&&n!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function Qe(e){let t=new WeakMap;function n(t,n){let r=t.array,i=t.usage,a=r.byteLength,o=e.createBuffer();e.bindBuffer(n,o),e.bufferData(n,r,i),t.onUploadCallback();let s;if(r instanceof Float32Array)s=e.FLOAT;else if(typeof Float16Array<`u`&&r instanceof Float16Array)s=e.HALF_FLOAT;else if(r instanceof Uint16Array)s=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(r instanceof Int16Array)s=e.SHORT;else if(r instanceof Uint32Array)s=e.UNSIGNED_INT;else if(r instanceof Int32Array)s=e.INT;else if(r instanceof Int8Array)s=e.BYTE;else if(r instanceof Uint8Array)s=e.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)s=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+r);return{buffer:o,type:s,bytesPerElement:r.BYTES_PER_ELEMENT,version:t.version,size:a}}function r(t,n,r){let i=n.array,a=n.updateRanges;if(e.bindBuffer(r,t),a.length===0)e.bufferSubData(r,0,i);else{a.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<a.length;e++){let n=a[t],r=a[e];r.start<=n.start+n.count+1?n.count=Math.max(n.count,r.start+r.count-n.start):(++t,a[t]=r)}a.length=t+1;for(let t=0,n=a.length;t<n;t++){let n=a[t];e.bufferSubData(r,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function i(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function a(n){n.isInterleavedBufferAttribute&&(n=n.data);let r=t.get(n);r&&(e.deleteBuffer(r.buffer),t.delete(n))}function o(e,i){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){let n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}let a=t.get(e);if(a===void 0)t.set(e,n(e,i));else if(a.version<e.version){if(a.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);r(a.buffer,e,i),a.version=e.version}}return{get:i,remove:a,update:o}}var Q={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,cube_uv_reflection_fragment:`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:`gl_FragColor = linearToOutputTexel( gl_FragColor );`,colorspace_pars_fragment:`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment:`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex:`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distanceRGBA_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distanceRGBA_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},$={common:{diffuse:{value:new U(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new q},alphaMap:{value:null},alphaMapTransform:{value:new q},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new q}},envmap:{envMap:{value:null},envMapRotation:{value:new q},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new q}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new q}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new q},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new q},normalScale:{value:new m(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new q},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new q}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new q}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new q}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new U(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new U(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new q},alphaTest:{value:0},uvTransform:{value:new q}},sprite:{diffuse:{value:new U(16777215)},opacity:{value:1},center:{value:new m(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new q},alphaMap:{value:null},alphaMapTransform:{value:new q},alphaTest:{value:0}}},$e={basic:{uniforms:z([$.common,$.specularmap,$.envmap,$.aomap,$.lightmap,$.fog]),vertexShader:Q.meshbasic_vert,fragmentShader:Q.meshbasic_frag},lambert:{uniforms:z([$.common,$.specularmap,$.envmap,$.aomap,$.lightmap,$.emissivemap,$.bumpmap,$.normalmap,$.displacementmap,$.fog,$.lights,{emissive:{value:new U(0)}}]),vertexShader:Q.meshlambert_vert,fragmentShader:Q.meshlambert_frag},phong:{uniforms:z([$.common,$.specularmap,$.envmap,$.aomap,$.lightmap,$.emissivemap,$.bumpmap,$.normalmap,$.displacementmap,$.fog,$.lights,{emissive:{value:new U(0)},specular:{value:new U(1118481)},shininess:{value:30}}]),vertexShader:Q.meshphong_vert,fragmentShader:Q.meshphong_frag},standard:{uniforms:z([$.common,$.envmap,$.aomap,$.lightmap,$.emissivemap,$.bumpmap,$.normalmap,$.displacementmap,$.roughnessmap,$.metalnessmap,$.fog,$.lights,{emissive:{value:new U(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Q.meshphysical_vert,fragmentShader:Q.meshphysical_frag},toon:{uniforms:z([$.common,$.aomap,$.lightmap,$.emissivemap,$.bumpmap,$.normalmap,$.displacementmap,$.gradientmap,$.fog,$.lights,{emissive:{value:new U(0)}}]),vertexShader:Q.meshtoon_vert,fragmentShader:Q.meshtoon_frag},matcap:{uniforms:z([$.common,$.bumpmap,$.normalmap,$.displacementmap,$.fog,{matcap:{value:null}}]),vertexShader:Q.meshmatcap_vert,fragmentShader:Q.meshmatcap_frag},points:{uniforms:z([$.points,$.fog]),vertexShader:Q.points_vert,fragmentShader:Q.points_frag},dashed:{uniforms:z([$.common,$.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Q.linedashed_vert,fragmentShader:Q.linedashed_frag},depth:{uniforms:z([$.common,$.displacementmap]),vertexShader:Q.depth_vert,fragmentShader:Q.depth_frag},normal:{uniforms:z([$.common,$.bumpmap,$.normalmap,$.displacementmap,{opacity:{value:1}}]),vertexShader:Q.meshnormal_vert,fragmentShader:Q.meshnormal_frag},sprite:{uniforms:z([$.sprite,$.fog]),vertexShader:Q.sprite_vert,fragmentShader:Q.sprite_frag},background:{uniforms:{uvTransform:{value:new q},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Q.background_vert,fragmentShader:Q.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new q}},vertexShader:Q.backgroundCube_vert,fragmentShader:Q.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Q.cube_vert,fragmentShader:Q.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Q.equirect_vert,fragmentShader:Q.equirect_frag},distanceRGBA:{uniforms:z([$.common,$.displacementmap,{referencePosition:{value:new b},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Q.distanceRGBA_vert,fragmentShader:Q.distanceRGBA_frag},shadow:{uniforms:z([$.lights,$.fog,{color:{value:new U(0)},opacity:{value:1}}]),vertexShader:Q.shadow_vert,fragmentShader:Q.shadow_frag}};$e.physical={uniforms:z([$e.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new q},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new q},clearcoatNormalScale:{value:new m(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new q},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new q},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new q},sheen:{value:0},sheenColor:{value:new U(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new q},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new q},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new q},transmissionSamplerSize:{value:new m},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new q},attenuationDistance:{value:0},attenuationColor:{value:new U(0)},specularColor:{value:new U(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new q},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new q},anisotropyVector:{value:new m},anisotropyMap:{value:null},anisotropyMapTransform:{value:new q}}]),vertexShader:Q.meshphysical_vert,fragmentShader:Q.meshphysical_frag};var et={r:0,b:0,g:0},tt=new _e,nt=new oe;function rt(e,t,n,r,i,a,o){let s=new U(0),c=a===!0?0:1,l,u,d=null,f=0,p=null;function m(e){let r=e.isScene===!0?e.background:null;return r&&r.isTexture&&(r=(e.backgroundBlurriness>0?n:t).get(r)),r}function h(t){let n=!1,i=m(t);i===null?_(s,c):i&&i.isColor&&(_(i,1),n=!0);let a=e.xr.getEnvironmentBlendMode();a===`additive`?r.buffers.color.setClear(0,0,0,1,o):a===`alpha-blend`&&r.buffers.color.setClear(0,0,0,0,o),(e.autoClear||n)&&(r.buffers.depth.setTest(!0),r.buffers.depth.setMask(!0),r.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function g(t,n){let r=m(n);r&&(r.isCubeTexture||r.mapping===306)?(u===void 0&&(u=new X(new G(1,1,1),new He({name:`BackgroundCubeMaterial`,uniforms:fe($e.backgroundCube.uniforms),vertexShader:$e.backgroundCube.vertexShader,fragmentShader:$e.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute(`normal`),u.geometry.deleteAttribute(`uv`),u.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(u)),tt.copy(n.backgroundRotation),tt.x*=-1,tt.y*=-1,tt.z*=-1,r.isCubeTexture&&r.isRenderTargetTexture===!1&&(tt.y*=-1,tt.z*=-1),u.material.uniforms.envMap.value=r,u.material.uniforms.flipEnvMap.value=r.isCubeTexture&&r.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=n.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(nt.makeRotationFromEuler(tt)),u.material.toneMapped=V.getTransfer(r.colorSpace)!==Ge,(d!==r||f!==r.version||p!==e.toneMapping)&&(u.material.needsUpdate=!0,d=r,f=r.version,p=e.toneMapping),u.layers.enableAll(),t.unshift(u,u.geometry,u.material,0,0,null)):r&&r.isTexture&&(l===void 0&&(l=new X(new M(2,2),new He({name:`BackgroundMaterial`,uniforms:fe($e.background.uniforms),vertexShader:$e.background.vertexShader,fragmentShader:$e.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute(`normal`),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=r,l.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,l.material.toneMapped=V.getTransfer(r.colorSpace)!==Ge,r.matrixAutoUpdate===!0&&r.updateMatrix(),l.material.uniforms.uvTransform.value.copy(r.matrix),(d!==r||f!==r.version||p!==e.toneMapping)&&(l.material.needsUpdate=!0,d=r,f=r.version,p=e.toneMapping),l.layers.enableAll(),t.unshift(l,l.geometry,l.material,0,0,null))}function _(t,n){t.getRGB(et,K(e)),r.buffers.color.setClear(et.r,et.g,et.b,n,o)}function v(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return s},setClearColor:function(e,t=1){s.set(e),c=t,_(s,c)},getClearAlpha:function(){return c},setClearAlpha:function(e){c=e,_(s,c)},render:h,addToRenderList:g,dispose:v}}function it(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},i=f(null),a=i,o=!1;function s(n,r,i,s,c){let u=!1,f=d(s,i,r);a!==f&&(a=f,l(a.object)),u=p(n,s,i,c),u&&m(n,s,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(u||o)&&(o=!1,b(n,r,i,s),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function c(){return e.createVertexArray()}function l(t){return e.bindVertexArray(t)}function u(t){return e.deleteVertexArray(t)}function d(e,t,n){let i=n.wireframe===!0,a=r[e.id];a===void 0&&(a={},r[e.id]=a);let o=a[t.id];o===void 0&&(o={},a[t.id]=o);let s=o[i];return s===void 0&&(s=f(c()),o[i]=s),s}function f(e){let t=[],r=[],i=[];for(let e=0;e<n;e++)t[e]=0,r[e]=0,i[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:i,object:e,attributes:{},index:null}}function p(e,t,n,r){let i=a.attributes,o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=i[t],r=o[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;s++}return a.attributesNum!==s||a.index!==r}function m(e,t,n,r){let i={},o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=o[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,s++}a.attributes=i,a.attributesNum=s,a.index=r}function h(){let e=a.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function g(e){_(e,0)}function _(t,n){let r=a.newAttributes,i=a.enabledAttributes,o=a.attributeDivisors;r[t]=1,i[t]===0&&(e.enableVertexAttribArray(t),i[t]=1),o[t]!==n&&(e.vertexAttribDivisor(t,n),o[t]=n)}function v(){let t=a.newAttributes,n=a.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function y(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function b(n,r,i,a){h();let o=a.attributes,s=i.getAttributes(),c=r.defaultAttributeValues;for(let r in s){let i=s[r];if(i.location>=0){let s=o[r];if(s===void 0&&(r===`instanceMatrix`&&n.instanceMatrix&&(s=n.instanceMatrix),r===`instanceColor`&&n.instanceColor&&(s=n.instanceColor)),s!==void 0){let r=s.normalized,o=s.itemSize,c=t.get(s);if(c===void 0)continue;let l=c.buffer,u=c.type,d=c.bytesPerElement,f=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===1013;if(s.isInterleavedBufferAttribute){let t=s.data,c=t.stride,p=s.offset;if(t.isInstancedInterleavedBuffer){for(let e=0;e<i.locationSize;e++)_(i.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,c*d,(p+o/i.locationSize*e)*d,f)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,s.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,o*d,o/i.locationSize*e*d,f)}}else if(c!==void 0){let t=c[r];if(t!==void 0)switch(t.length){case 2:e.vertexAttrib2fv(i.location,t);break;case 3:e.vertexAttrib3fv(i.location,t);break;case 4:e.vertexAttrib4fv(i.location,t);break;default:e.vertexAttrib1fv(i.location,t)}}}}v()}function x(){w();for(let e in r){let t=r[e];for(let e in t){let n=t[e];for(let e in n)u(n[e].object),delete n[e];delete t[e]}delete r[e]}}function S(e){if(r[e.id]===void 0)return;let t=r[e.id];for(let e in t){let n=t[e];for(let e in n)u(n[e].object),delete n[e];delete t[e]}delete r[e.id]}function C(e){for(let t in r){let n=r[t];if(n[e.id]===void 0)continue;let i=n[e.id];for(let e in i)u(i[e].object),delete i[e];delete n[e.id]}}function w(){T(),o=!0,a!==i&&(a=i,l(a.object))}function T(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:s,reset:w,resetDefaultState:T,dispose:x,releaseStatesOfGeometry:S,releaseStatesOfProgram:C,initAttributes:h,enableAttribute:g,disableUnusedAttributes:v}}function at(e,t,n){let r;function i(e){r=e}function a(t,i){e.drawArrays(r,t,i),n.update(i,r,1)}function o(t,i,a){a!==0&&(e.drawArraysInstanced(r,t,i,a),n.update(i,r,a))}function s(e,i,a){if(a===0)return;t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r,e,0,i,0,a);let o=0;for(let e=0;e<a;e++)o+=i[e];n.update(o,r,1)}function c(e,i,a,s){if(a===0)return;let c=t.get(`WEBGL_multi_draw`);if(c===null)for(let t=0;t<e.length;t++)o(e[t],i[t],s[t]);else{c.multiDrawArraysInstancedWEBGL(r,e,0,i,0,s,0,a);let t=0;for(let e=0;e<a;e++)t+=i[e]*s[e];n.update(t,r,1)}}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=s,this.renderMultiDrawInstances=c}function ot(e,t,n,r){let i;function a(){if(i!==void 0)return i;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);i=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(t){return t===1023||r.convert(t)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT)}function s(n){let i=n===1016&&(t.has(`EXT_color_buffer_half_float`)||t.has(`EXT_color_buffer_float`));return!(n!==1009&&r.convert(n)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE)&&n!==1015&&!i)}function c(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let l=n.precision===void 0?`highp`:n.precision,u=c(l);u!==l&&(console.warn(`THREE.WebGLRenderer:`,l,`not supported, using`,u,`instead.`),l=u);let d=n.logarithmicDepthBuffer===!0,f=n.reversedDepthBuffer===!0&&t.has(`EXT_clip_control`),p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),_=e.getParameter(e.MAX_VERTEX_ATTRIBS),v=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),y=e.getParameter(e.MAX_VARYING_VECTORS),b=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),x=m>0,S=e.getParameter(e.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:s,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:m,maxTextureSize:h,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:b,vertexTextures:x,maxSamples:S}}function st(e){let t=this,n=null,r=0,i=!1,a=!1,o=new Ue,s=new q,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=u(e,t,0)},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}function ct(e){let t=new WeakMap;function n(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function r(r){if(r&&r.isTexture){let a=r.mapping;if(a===303||a===304){if(t.has(r)){let e=t.get(r).texture;return n(e,r.mapping)}{let a=r.image;if(a&&a.height>0){let o=new L(a.height);return o.fromEquirectangularTexture(e,r),t.set(r,o),r.addEventListener(`dispose`,i),n(o.texture,r.mapping)}return null}}}return r}function i(e){let n=e.target;n.removeEventListener(`dispose`,i);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function a(){t=new WeakMap}return{get:r,dispose:a}}var lt=4,ut=[.125,.215,.35,.446,.526,.582],dt=20,ft=new Le,pt=new U,mt=null,ht=0,gt=0,_t=!1,vt=(1+Math.sqrt(5))/2,yt=1/vt,bt=[new b(-vt,yt,0),new b(vt,yt,0),new b(-yt,0,vt),new b(yt,0,vt),new b(0,vt,-yt),new b(0,vt,yt),new b(-1,1,-1),new b(1,1,-1),new b(-1,1,1),new b(1,1,1)],xt=new b,St=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,r=100,i={}){let{size:a=256,position:o=xt}=i;mt=this._renderer.getRenderTarget(),ht=this._renderer.getActiveCubeFace(),gt=this._renderer.getActiveMipmapLevel(),_t=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s,o),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ot(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Dt(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=2**this._lodMax}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(mt,ht,gt),this._renderer.xr.enabled=_t,e.scissorTest=!1,Tt(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),mt=this._renderer.getRenderTarget(),ht=this._renderer.getActiveCubeFace(),gt=this._renderer.getActiveMipmapLevel(),_t=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,r={magFilter:I,minFilter:I,generateMipmaps:!1,type:a,format:Y,colorSpace:e,depthBuffer:!1},i=wt(t,n,r);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=wt(t,n,r);let{_lodMax:e}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Ct(e)),this._blurMaterial=Et(e,t,n)}return i}_compileMaterial(e){let t=new X(this._lodPlanes[0],e);this._renderer.compile(t,ft)}_sceneToCubeUV(e,t,n,r,i){let a=new ce(90,1,t,n),o=[1,-1,1,1,1,1],s=[1,1,1,-1,-1,-1],c=this._renderer,l=c.autoClear,u=c.toneMapping;c.getClearColor(pt),c.toneMapping=0,c.autoClear=!1,c.state.buffers.depth.getReversed()&&(c.setRenderTarget(r),c.clearDepth(),c.setRenderTarget(null));let d=new je({name:`PMREM.Background`,side:1,depthWrite:!1,depthTest:!1}),f=new X(new G,d),p=!1,m=e.background;m?m.isColor&&(d.color.copy(m),e.background=null,p=!0):(d.color.copy(pt),p=!0);for(let t=0;t<6;t++){let n=t%3;n===0?(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x+s[t],i.y,i.z)):n===1?(a.up.set(0,0,o[t]),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y+s[t],i.z)):(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y,i.z+s[t]));let l=this._cubeSize;Tt(r,n*l,t>2?l:0,l,l),c.setRenderTarget(r),p&&c.render(f,a),c.render(e,a)}f.geometry.dispose(),f.material.dispose(),c.toneMapping=u,c.autoClear=l,e.background=m}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===301||e.mapping===302;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ot()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Dt());let i=r?this._cubemapMaterial:this._equirectMaterial,a=new X(this._lodPlanes[0],i),o=i.uniforms;o.envMap.value=e;let s=this._cubeSize;Tt(t,0,0,3*s,2*s),n.setRenderTarget(t),n.render(a,ft)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let r=this._lodPlanes.length;for(let t=1;t<r;t++){let n=Math.sqrt(this._sigmas[t]*this._sigmas[t]-this._sigmas[t-1]*this._sigmas[t-1]),i=bt[(r-t-1)%bt.length];this._blur(e,t-1,t,n,i)}t.autoClear=n}_blur(e,t,n,r,i){let a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,r,`latitudinal`,i),this._halfBlur(a,e,n,n,r,`longitudinal`,i)}_halfBlur(e,t,n,r,i,a,o){let s=this._renderer,c=this._blurMaterial;a!==`latitudinal`&&a!==`longitudinal`&&console.error(`blur direction must be either latitudinal or longitudinal!`);let l=new X(this._lodPlanes[r],c),u=c.uniforms,d=this._sizeLods[n]-1,f=isFinite(i)?Math.PI/(2*d):2*Math.PI/39,p=i/f,m=isFinite(i)?1+Math.floor(3*p):dt;m>dt&&console.warn(`sigmaRadians, ${i}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${dt}`);let h=[],g=0;for(let e=0;e<dt;++e){let t=e/p,n=Math.exp(-t*t/2);h.push(n),e===0?g+=n:e<m&&(g+=2*n)}for(let e=0;e<h.length;e++)h[e]=h[e]/g;u.envMap.value=e.texture,u.samples.value=m,u.weights.value=h,u.latitudinal.value=a===`latitudinal`,o&&(u.poleAxis.value=o);let{_lodMax:_}=this;u.dTheta.value=f,u.mipInt.value=_-n;let v=this._sizeLods[r];Tt(t,3*v*(r>_-lt?r-_+lt:0),4*(this._cubeSize-v),3*v,2*v),s.setRenderTarget(t),s.render(l,ft)}};function Ct(e){let t=[],n=[],r=[],i=e,a=e-lt+1+ut.length;for(let o=0;o<a;o++){let a=2**i;n.push(a);let s=1/a;o>e-lt?s=ut[o-e+lt-1]:o===0&&(s=0),r.push(s);let c=1/(a-2),l=-c,u=1+c,d=[l,l,u,l,u,u,l,l,u,u,l,u],f=new Float32Array(108),p=new Float32Array(72),m=new Float32Array(36);for(let e=0;e<6;e++){let t=e%3*2/3-1,n=e>2?0:-1,r=[t,n,0,t+2/3,n,0,t+2/3,n+1,0,t,n,0,t+2/3,n+1,0,t,n+1,0];f.set(r,18*e),p.set(d,12*e);let i=[e,e,e,e,e,e];m.set(i,6*e)}let h=new Ae;h.setAttribute(`position`,new Ce(f,3)),h.setAttribute(`uv`,new Ce(p,2)),h.setAttribute(`faceIndex`,new Ce(m,1)),t.push(h),i>lt&&i--}return{lodPlanes:t,sizeLods:n,sigmas:r}}function wt(e,t,n){let r=new R(e,t,n);return r.texture.mapping=306,r.texture.name=`PMREM.cubeUv`,r.scissorTest=!0,r}function Tt(e,t,n,r,i){e.viewport.set(t,n,r,i),e.scissor.set(t,n,r,i)}function Et(e,t,n){let r=new Float32Array(dt),i=new b(0,1,0);return new He({name:`SphericalGaussianBlur`,defines:{n:dt,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:r},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:kt(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Dt(){return new He({name:`EquirectangularToCubeUV`,uniforms:{envMap:{value:null}},vertexShader:kt(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Ot(){return new He({name:`CubemapToCubeUV`,uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:kt(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function kt(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function At(e){let t=new WeakMap,n=null;function r(r){if(r&&r.isTexture){let o=r.mapping,s=o===303||o===304,c=o===301||o===302;if(s||c){let o=t.get(r),l=o===void 0?0:o.texture.pmremVersion;if(r.isRenderTargetTexture&&r.pmremVersion!==l)return n===null&&(n=new St(e)),o=s?n.fromEquirectangular(r,o):n.fromCubemap(r,o),o.texture.pmremVersion=r.pmremVersion,t.set(r,o),o.texture;if(o!==void 0)return o.texture;{let l=r.image;return s&&l&&l.height>0||c&&l&&i(l)?(n===null&&(n=new St(e)),o=s?n.fromEquirectangular(r):n.fromCubemap(r),o.texture.pmremVersion=r.pmremVersion,t.set(r,o),r.addEventListener(`dispose`,a),o.texture):null}}}return r}function i(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function a(e){let n=e.target;n.removeEventListener(`dispose`,a);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function o(){t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:r,dispose:o}}function jt(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r;switch(n){case`WEBGL_depth_texture`:r=e.getExtension(`WEBGL_depth_texture`)||e.getExtension(`MOZ_WEBGL_depth_texture`)||e.getExtension(`WEBKIT_WEBGL_depth_texture`);break;case`EXT_texture_filter_anisotropic`:r=e.getExtension(`EXT_texture_filter_anisotropic`)||e.getExtension(`MOZ_EXT_texture_filter_anisotropic`)||e.getExtension(`WEBKIT_EXT_texture_filter_anisotropic`);break;case`WEBGL_compressed_texture_s3tc`:r=e.getExtension(`WEBGL_compressed_texture_s3tc`)||e.getExtension(`MOZ_WEBGL_compressed_texture_s3tc`)||e.getExtension(`WEBKIT_WEBGL_compressed_texture_s3tc`);break;case`WEBGL_compressed_texture_pvrtc`:r=e.getExtension(`WEBGL_compressed_texture_pvrtc`)||e.getExtension(`WEBKIT_WEBGL_compressed_texture_pvrtc`);break;default:r=e.getExtension(n)}return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(){n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`),n(`WEBGL_render_shared_exponent`)},get:function(e){let t=n(e);return t===null&&Z(`THREE.WebGLRenderer: `+e+` extension not supported.`),t}}}function Mt(e,n,r,i){let a={},o=new WeakMap;function s(e){let t=e.target;t.index!==null&&n.remove(t.index);for(let e in t.attributes)n.remove(t.attributes[e]);t.removeEventListener(`dispose`,s),delete a[t.id];let c=o.get(t);c&&(n.remove(c),o.delete(t)),i.releaseStatesOfGeometry(t),t.isInstancedBufferGeometry===!0&&delete t._maxInstanceCount,r.memory.geometries--}function c(e,t){return a[t.id]===!0||(t.addEventListener(`dispose`,s),a[t.id]=!0,r.memory.geometries++),t}function l(t){let r=t.attributes;for(let t in r)n.update(r[t],e.ARRAY_BUFFER)}function u(e){let r=[],i=e.index,a=e.attributes.position,s=0;if(i!==null){let e=i.array;s=i.version;for(let t=0,n=e.length;t<n;t+=3){let n=e[t+0],i=e[t+1],a=e[t+2];r.push(n,i,i,a,a,n)}}else if(a!==void 0){let e=a.array;s=a.version;for(let t=0,n=e.length/3-1;t<n;t+=3){let e=t+0,n=t+1,i=t+2;r.push(e,n,n,i,i,e)}}else return;let c=new(t(r)?f:O)(r,1);c.version=s;let l=o.get(e);l&&n.remove(l),o.set(e,c)}function d(e){let t=o.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&u(e)}else u(e);return o.get(e)}return{get:c,update:l,getWireframeAttribute:d}}function Nt(e,t,n){let r;function i(e){r=e}let a,o;function s(e){a=e.type,o=e.bytesPerElement}function c(t,i){e.drawElements(r,i,a,t*o),n.update(i,r,1)}function l(t,i,s){s!==0&&(e.drawElementsInstanced(r,i,a,t*o,s),n.update(i,r,s))}function u(e,i,o){if(o===0)return;t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r,i,0,a,e,0,o);let s=0;for(let e=0;e<o;e++)s+=i[e];n.update(s,r,1)}function d(e,i,s,c){if(s===0)return;let u=t.get(`WEBGL_multi_draw`);if(u===null)for(let t=0;t<e.length;t++)l(e[t]/o,i[t],c[t]);else{u.multiDrawElementsInstancedWEBGL(r,i,0,a,e,0,c,0,s);let t=0;for(let e=0;e<s;e++)t+=i[e]*c[e];n.update(t,r,1)}}this.setMode=i,this.setIndex=s,this.render=c,this.renderInstances=l,this.renderMultiDraw=u,this.renderMultiDrawInstances=d}function Pt(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:console.error(`THREE.WebGLInfo: Unknown draw mode:`,r)}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function Ft(e,t,n){let r=new WeakMap,i=new De;function a(a,o,s){let c=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l===void 0?0:l.length,d=r.get(o);if(d===void 0||d.count!==u){d!==void 0&&d.texture.dispose();let e=o.morphAttributes.position!==void 0,n=o.morphAttributes.normal!==void 0,a=o.morphAttributes.color!==void 0,s=o.morphAttributes.position||[],c=o.morphAttributes.normal||[],l=o.morphAttributes.color||[],f=0;e===!0&&(f=1),n===!0&&(f=2),a===!0&&(f=3);let p=o.attributes.position.count*f,h=1;p>t.maxTextureSize&&(h=Math.ceil(p/t.maxTextureSize),p=t.maxTextureSize);let g=new Float32Array(p*h*4*u),_=new Ve(g,p,h,u);_.type=D,_.needsUpdate=!0;let v=f*4;for(let t=0;t<u;t++){let r=s[t],o=c[t],u=l[t],d=p*h*4*t;for(let t=0;t<r.count;t++){let s=t*v;e===!0&&(i.fromBufferAttribute(r,t),g[d+s+0]=i.x,g[d+s+1]=i.y,g[d+s+2]=i.z,g[d+s+3]=0),n===!0&&(i.fromBufferAttribute(o,t),g[d+s+4]=i.x,g[d+s+5]=i.y,g[d+s+6]=i.z,g[d+s+7]=0),a===!0&&(i.fromBufferAttribute(u,t),g[d+s+8]=i.x,g[d+s+9]=i.y,g[d+s+10]=i.z,g[d+s+11]=u.itemSize===4?i.w:1)}}d={count:u,texture:_,size:new m(p,h)},r.set(o,d);function y(){_.dispose(),r.delete(o),o.removeEventListener(`dispose`,y)}o.addEventListener(`dispose`,y)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)s.getUniforms().setValue(e,`morphTexture`,a.morphTexture,n);else{let t=0;for(let e=0;e<c.length;e++)t+=c[e];let n=o.morphTargetsRelative?1:1-t;s.getUniforms().setValue(e,`morphTargetBaseInfluence`,n),s.getUniforms().setValue(e,`morphTargetInfluences`,c)}s.getUniforms().setValue(e,`morphTargetsTexture`,d.texture,n),s.getUniforms().setValue(e,`morphTargetsTextureSize`,d.size)}return{update:a}}function It(e,t,n,r){let i=new WeakMap;function a(a){let o=r.render.frame,c=a.geometry,l=t.get(a,c);if(i.get(l)!==o&&(t.update(l),i.set(l,o)),a.isInstancedMesh&&(a.hasEventListener(`dispose`,s)===!1&&a.addEventListener(`dispose`,s),i.get(a)!==o&&(n.update(a.instanceMatrix,e.ARRAY_BUFFER),a.instanceColor!==null&&n.update(a.instanceColor,e.ARRAY_BUFFER),i.set(a,o))),a.isSkinnedMesh){let e=a.skeleton;i.get(e)!==o&&(e.update(),i.set(e,o))}return l}function o(){i=new WeakMap}function s(e){let t=e.target;t.removeEventListener(`dispose`,s),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:a,dispose:o}}var Lt=new r,Rt=new ee(1,1),zt=new Ve,Bt=new se,Vt=new Fe,Ht=[],Ut=[],Wt=new Float32Array(16),Gt=new Float32Array(9),Kt=new Float32Array(4);function qt(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=Ht[i];if(a===void 0&&(a=new Float32Array(i),Ht[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function Jt(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function Yt(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function Xt(e,t){let n=Ut[t];n===void 0&&(n=new Int32Array(t),Ut[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function Zt(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function Qt(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Jt(n,t))return;e.uniform2fv(this.addr,t),Yt(n,t)}}function $t(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(Jt(n,t))return;e.uniform3fv(this.addr,t),Yt(n,t)}}function en(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Jt(n,t))return;e.uniform4fv(this.addr,t),Yt(n,t)}}function tn(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Jt(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),Yt(n,t)}else{if(Jt(n,r))return;Kt.set(r),e.uniformMatrix2fv(this.addr,!1,Kt),Yt(n,r)}}function nn(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Jt(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),Yt(n,t)}else{if(Jt(n,r))return;Gt.set(r),e.uniformMatrix3fv(this.addr,!1,Gt),Yt(n,r)}}function rn(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Jt(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),Yt(n,t)}else{if(Jt(n,r))return;Wt.set(r),e.uniformMatrix4fv(this.addr,!1,Wt),Yt(n,r)}}function an(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function on(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Jt(n,t))return;e.uniform2iv(this.addr,t),Yt(n,t)}}function sn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Jt(n,t))return;e.uniform3iv(this.addr,t),Yt(n,t)}}function cn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Jt(n,t))return;e.uniform4iv(this.addr,t),Yt(n,t)}}function ln(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function un(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Jt(n,t))return;e.uniform2uiv(this.addr,t),Yt(n,t)}}function dn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Jt(n,t))return;e.uniform3uiv(this.addr,t),Yt(n,t)}}function fn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Jt(n,t))return;e.uniform4uiv(this.addr,t),Yt(n,t)}}function pn(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;this.type===e.SAMPLER_2D_SHADOW?(Rt.compareFunction=515,a=Rt):a=Lt,n.setTexture2D(t||a,i)}function mn(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||Bt,i)}function hn(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTextureCube(t||Vt,i)}function gn(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||zt,i)}function _n(e){switch(e){case 5126:return Zt;case 35664:return Qt;case 35665:return $t;case 35666:return en;case 35674:return tn;case 35675:return nn;case 35676:return rn;case 5124:case 35670:return an;case 35667:case 35671:return on;case 35668:case 35672:return sn;case 35669:case 35673:return cn;case 5125:return ln;case 36294:return un;case 36295:return dn;case 36296:return fn;case 35678:case 36198:case 36298:case 36306:case 35682:return pn;case 35679:case 36299:case 36307:return mn;case 35680:case 36300:case 36308:case 36293:return hn;case 36289:case 36303:case 36311:case 36292:return gn}}function vn(e,t){e.uniform1fv(this.addr,t)}function yn(e,t){let n=qt(t,this.size,2);e.uniform2fv(this.addr,n)}function bn(e,t){let n=qt(t,this.size,3);e.uniform3fv(this.addr,n)}function xn(e,t){let n=qt(t,this.size,4);e.uniform4fv(this.addr,n)}function Sn(e,t){let n=qt(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function Cn(e,t){let n=qt(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function wn(e,t){let n=qt(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function Tn(e,t){e.uniform1iv(this.addr,t)}function En(e,t){e.uniform2iv(this.addr,t)}function Dn(e,t){e.uniform3iv(this.addr,t)}function On(e,t){e.uniform4iv(this.addr,t)}function kn(e,t){e.uniform1uiv(this.addr,t)}function An(e,t){e.uniform2uiv(this.addr,t)}function jn(e,t){e.uniform3uiv(this.addr,t)}function Mn(e,t){e.uniform4uiv(this.addr,t)}function Nn(e,t,n){let r=this.cache,i=t.length,a=Xt(n,i);Jt(r,a)||(e.uniform1iv(this.addr,a),Yt(r,a));for(let e=0;e!==i;++e)n.setTexture2D(t[e]||Lt,a[e])}function Pn(e,t,n){let r=this.cache,i=t.length,a=Xt(n,i);Jt(r,a)||(e.uniform1iv(this.addr,a),Yt(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||Bt,a[e])}function Fn(e,t,n){let r=this.cache,i=t.length,a=Xt(n,i);Jt(r,a)||(e.uniform1iv(this.addr,a),Yt(r,a));for(let e=0;e!==i;++e)n.setTextureCube(t[e]||Vt,a[e])}function In(e,t,n){let r=this.cache,i=t.length,a=Xt(n,i);Jt(r,a)||(e.uniform1iv(this.addr,a),Yt(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||zt,a[e])}function Ln(e){switch(e){case 5126:return vn;case 35664:return yn;case 35665:return bn;case 35666:return xn;case 35674:return Sn;case 35675:return Cn;case 35676:return wn;case 5124:case 35670:return Tn;case 35667:case 35671:return En;case 35668:case 35672:return Dn;case 35669:case 35673:return On;case 5125:return kn;case 36294:return An;case 36295:return jn;case 36296:return Mn;case 35678:case 36198:case 36298:case 36306:case 35682:return Nn;case 35679:case 36299:case 36307:return Pn;case 35680:case 36300:case 36308:case 36293:return Fn;case 36289:case 36303:case 36311:case 36292:return In}}var Rn=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=_n(t.type)}},zn=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Ln(t.type)}},Bn=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},Vn=/(\w+)(\])?(\[|\.)?/g;function Hn(e,t){e.seq.push(t),e.map[t.id]=t}function Un(e,t,n){let r=e.name,i=r.length;for(Vn.lastIndex=0;;){let a=Vn.exec(r),o=Vn.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){Hn(n,l===void 0?new Rn(s,e,t):new zn(s,e,t));break}{let e=n.map[s];e===void 0&&(e=new Bn(s),Hn(n,e)),n=e}}}var Wn=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);Un(n,e.getUniformLocation(t,n.name),this)}}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function Gn(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var Kn=37297,qn=0;function Jn(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}var Yn=new q;function Xn(e){V._getMatrix(Yn,V.workingColorSpace,e);let t=`mat3( ${Yn.elements.map(e=>e.toFixed(4))} )`;switch(V.getTransfer(e)){case pe:return[t,`LinearTransferOETF`];case Ge:return[t,`sRGBTransferOETF`];default:return console.warn(`THREE.WebGLProgram: Unsupported color space: `,e),[t,`LinearTransferOETF`]}}function Zn(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=(e.getShaderInfoLog(t)||``).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+Jn(e.getShaderSource(t),r)}return i}function Qn(e,t){let n=Xn(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,`}`].join(`
`)}function $n(e,t){let n;switch(t){case 1:n=`Linear`;break;case 2:n=`Reinhard`;break;case 3:n=`Cineon`;break;case 4:n=`ACESFilmic`;break;case 6:n=`AgX`;break;case 7:n=`Neutral`;break;case 5:n=`Custom`;break;default:console.warn(`THREE.WebGLProgram: Unsupported toneMapping:`,t),n=`Linear`}return`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}var er=new b;function tr(){return V.getLuminanceCoefficients(er),[`float luminance( const in vec3 rgb ) {`,`	const vec3 weights = vec3( ${er.x.toFixed(4)}, ${er.y.toFixed(4)}, ${er.z.toFixed(4)} );`,`	return dot( weights, rgb );`,`}`].join(`
`)}function nr(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``,e.extensionMultiDraw?`#extension GL_ANGLE_multi_draw : require`:``].filter(ar).join(`
`)}function rr(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function ir(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function ar(e){return e!==``}function or(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function sr(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var cr=/^[ \t]*#include +<([\w\d./]+)>/gm;function lr(e){return e.replace(cr,dr)}var ur=new Map;function dr(e,t){let n=Q[t];if(n===void 0){let e=ur.get(t);if(e!==void 0)n=Q[e],console.warn(`THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.`,t,e);else throw Error(`Can not resolve #include <`+t+`>`)}return lr(n)}var fr=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function pr(e){return e.replace(fr,mr)}function mr(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function hr(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision===`highp`?t+=`
#define HIGH_PRECISION`:e.precision===`mediump`?t+=`
#define MEDIUM_PRECISION`:e.precision===`lowp`&&(t+=`
#define LOW_PRECISION`),t}function gr(e){let t=`SHADOWMAP_TYPE_BASIC`;return e.shadowMapType===1?t=`SHADOWMAP_TYPE_PCF`:e.shadowMapType===2?t=`SHADOWMAP_TYPE_PCF_SOFT`:e.shadowMapType===3&&(t=`SHADOWMAP_TYPE_VSM`),t}function _r(e){let t=`ENVMAP_TYPE_CUBE`;if(e.envMap)switch(e.envMapMode){case 301:case 302:t=`ENVMAP_TYPE_CUBE`;break;case 306:t=`ENVMAP_TYPE_CUBE_UV`}return t}function vr(e){let t=`ENVMAP_MODE_REFLECTION`;if(e.envMap)switch(e.envMapMode){case 302:t=`ENVMAP_MODE_REFRACTION`}return t}function yr(e){let t=`ENVMAP_BLENDING_NONE`;if(e.envMap)switch(e.combine){case 0:t=`ENVMAP_BLENDING_MULTIPLY`;break;case 1:t=`ENVMAP_BLENDING_MIX`;break;case 2:t=`ENVMAP_BLENDING_ADD`}return t}function br(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let n=Math.log2(t)-2,r=1/t;return{texelWidth:1/(3*Math.max(2**n,112)),texelHeight:r,maxMip:n}}function xr(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=gr(n),l=_r(n),u=vr(n),d=yr(n),f=br(n),p=nr(n),m=rr(a),h=i.createProgram(),g,_,v=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(g=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(ar).join(`
`),g.length>0&&(g+=`
`),_=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(ar).join(`
`),_.length>0&&(_+=`
`)):(g=[hr(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.batchingColor?`#define USE_BATCHING_COLOR`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.instancingMorph?`#define USE_INSTANCING_MORPH`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`#ifdef USE_INSTANCING_MORPH`,`	uniform sampler2D morphTexture;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(ar).join(`
`),_=[hr(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.alphaToCoverage?`#define ALPHA_TO_COVERAGE`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,f?`#define CUBEUV_TEXEL_WIDTH `+f.texelWidth:``,f?`#define CUBEUV_TEXEL_HEIGHT `+f.texelHeight:``,f?`#define CUBEUV_MAX_MIP `+f.maxMip+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.dispersion?`#define USE_DISPERSION`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor||n.batchingColor?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.decodeVideoTextureEmissive?`#define DECODE_VIDEO_TEXTURE_EMISSIVE`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:Q.tonemapping_pars_fragment,n.toneMapping===0?``:$n(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,Q.colorspace_pars_fragment,Qn(`linearToOutputTexel`,n.outputColorSpace),tr(),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(ar).join(`
`)),o=lr(o),o=or(o,n),o=sr(o,n),s=lr(s),s=or(s,n),s=sr(s,n),o=pr(o),s=pr(s),n.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[p,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+g,_=[`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+_);let y=v+g+o,b=v+_+s,x=Gn(i,i.VERTEX_SHADER,y),S=Gn(i,i.FRAGMENT_SHADER,b);i.attachShader(h,x),i.attachShader(h,S),n.index0AttributeName===void 0?n.morphTargets===!0&&i.bindAttribLocation(h,0,`position`):i.bindAttribLocation(h,0,n.index0AttributeName),i.linkProgram(h);function C(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(h)||``,r=i.getShaderInfoLog(x)||``,a=i.getShaderInfoLog(S)||``,o=n.trim(),s=r.trim(),c=a.trim(),l=!0,u=!0;if(i.getProgramParameter(h,i.LINK_STATUS)===!1){if(l=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,h,x,S);else{let e=Zn(i,x,`vertex`),n=Zn(i,S,`fragment`);console.error(`THREE.WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(h,i.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+o+`
`+e+`
`+n)}}else o===``?(s===``||c===``)&&(u=!1):console.warn(`THREE.WebGLProgram: Program Info Log:`,o);u&&(t.diagnostics={runnable:l,programLog:o,vertexShader:{log:s,prefix:g},fragmentShader:{log:c,prefix:_}})}i.deleteShader(x),i.deleteShader(S),w=new Wn(i,h),T=ir(i,h)}let w;this.getUniforms=function(){return w===void 0&&C(this),w};let T;this.getAttributes=function(){return T===void 0&&C(this),T};let E=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=i.getProgramParameter(h,Kn)),E},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(h),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=qn++,this.cacheKey=t,this.usedTimes=1,this.program=h,this.vertexShader=x,this.fragmentShader=S,this}var Sr=0,Cr=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,r=this._getShaderStage(t),i=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(i)===!1&&(a.add(i),i.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new wr(e),t.set(e,n)),n}},wr=class{constructor(e){this.id=Sr++,this.code=e,this.usedTimes=0}};function Tr(t,n,r,i,a,o,s){let c=new y,l=new Cr,u=new Set,d=[],f=a.logarithmicDepthBuffer,p=a.vertexTextures,m=a.precision,h={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distanceRGBA`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function g(e){return u.add(e),e===0?`uv`:`uv${e}`}function v(o,c,d,_,v){let y=_.fog,b=v.geometry,x=o.isMeshStandardMaterial?_.environment:null,S=(o.isMeshStandardMaterial?r:n).get(o.envMap||x),C=S&&S.mapping===306?S.image.height:null,w=h[o.type];o.precision!==null&&(m=a.getMaxPrecision(o.precision),m!==o.precision&&console.warn(`THREE.WebGLProgram.getParameters:`,o.precision,`not supported, using`,m,`instead.`));let T=b.morphAttributes.position||b.morphAttributes.normal||b.morphAttributes.color,E=T===void 0?0:T.length,D=0;b.morphAttributes.position!==void 0&&(D=1),b.morphAttributes.normal!==void 0&&(D=2),b.morphAttributes.color!==void 0&&(D=3);let O,k,A,j;if(w){let e=$e[w];O=e.vertexShader,k=e.fragmentShader}else O=o.vertexShader,k=o.fragmentShader,l.update(o),A=l.getVertexShaderID(o),j=l.getFragmentShaderID(o);let M=t.getRenderTarget(),ee=t.state.buffers.depth.getReversed(),N=v.isInstancedMesh===!0,P=v.isBatchedMesh===!0,te=!!o.map,F=!!o.matcap,I=!!S,L=!!o.aoMap,ne=!!o.lightMap,re=!!o.bumpMap,ie=!!o.normalMap,R=!!o.displacementMap,ae=!!o.emissiveMap,z=!!o.metalnessMap,oe=!!o.roughnessMap,se=o.anisotropy>0,B=o.clearcoat>0,ce=o.dispersion>0,le=o.iridescence>0,ue=o.sheen>0,de=o.transmission>0,fe=se&&!!o.anisotropyMap,pe=B&&!!o.clearcoatMap,me=B&&!!o.clearcoatNormalMap,he=B&&!!o.clearcoatRoughnessMap,H=le&&!!o.iridescenceMap,U=le&&!!o.iridescenceThicknessMap,ge=ue&&!!o.sheenColorMap,W=ue&&!!o.sheenRoughnessMap,G=!!o.specularMap,K=!!o.specularColorMap,q=!!o.specularIntensityMap,J=de&&!!o.transmissionMap,Y=de&&!!o.thicknessMap,_e=!!o.gradientMap,ve=!!o.alphaMap,ye=o.alphaTest>0,be=!!o.alphaHash,xe=!!o.extensions,Se=0;o.toneMapped&&(M===null||M.isXRRenderTarget===!0)&&(Se=t.toneMapping);let Ce={shaderID:w,shaderType:o.type,shaderName:o.name,vertexShader:O,fragmentShader:k,defines:o.defines,customVertexShaderID:A,customFragmentShaderID:j,isRawShaderMaterial:o.isRawShaderMaterial===!0,glslVersion:o.glslVersion,precision:m,batching:P,batchingColor:P&&v._colorsTexture!==null,instancing:N,instancingColor:N&&v.instanceColor!==null,instancingMorph:N&&v.morphTexture!==null,supportsVertexTextures:p,outputColorSpace:M===null?t.outputColorSpace:M.isXRRenderTarget===!0?M.texture.colorSpace:e,alphaToCoverage:!!o.alphaToCoverage,map:te,matcap:F,envMap:I,envMapMode:I&&S.mapping,envMapCubeUVHeight:C,aoMap:L,lightMap:ne,bumpMap:re,normalMap:ie,displacementMap:p&&R,emissiveMap:ae,normalMapObjectSpace:ie&&o.normalMapType===1,normalMapTangentSpace:ie&&o.normalMapType===0,metalnessMap:z,roughnessMap:oe,anisotropy:se,anisotropyMap:fe,clearcoat:B,clearcoatMap:pe,clearcoatNormalMap:me,clearcoatRoughnessMap:he,dispersion:ce,iridescence:le,iridescenceMap:H,iridescenceThicknessMap:U,sheen:ue,sheenColorMap:ge,sheenRoughnessMap:W,specularMap:G,specularColorMap:K,specularIntensityMap:q,transmission:de,transmissionMap:J,thicknessMap:Y,gradientMap:_e,opaque:o.transparent===!1&&o.blending===1&&o.alphaToCoverage===!1,alphaMap:ve,alphaTest:ye,alphaHash:be,combine:o.combine,mapUv:te&&g(o.map.channel),aoMapUv:L&&g(o.aoMap.channel),lightMapUv:ne&&g(o.lightMap.channel),bumpMapUv:re&&g(o.bumpMap.channel),normalMapUv:ie&&g(o.normalMap.channel),displacementMapUv:R&&g(o.displacementMap.channel),emissiveMapUv:ae&&g(o.emissiveMap.channel),metalnessMapUv:z&&g(o.metalnessMap.channel),roughnessMapUv:oe&&g(o.roughnessMap.channel),anisotropyMapUv:fe&&g(o.anisotropyMap.channel),clearcoatMapUv:pe&&g(o.clearcoatMap.channel),clearcoatNormalMapUv:me&&g(o.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:he&&g(o.clearcoatRoughnessMap.channel),iridescenceMapUv:H&&g(o.iridescenceMap.channel),iridescenceThicknessMapUv:U&&g(o.iridescenceThicknessMap.channel),sheenColorMapUv:ge&&g(o.sheenColorMap.channel),sheenRoughnessMapUv:W&&g(o.sheenRoughnessMap.channel),specularMapUv:G&&g(o.specularMap.channel),specularColorMapUv:K&&g(o.specularColorMap.channel),specularIntensityMapUv:q&&g(o.specularIntensityMap.channel),transmissionMapUv:J&&g(o.transmissionMap.channel),thicknessMapUv:Y&&g(o.thicknessMap.channel),alphaMapUv:ve&&g(o.alphaMap.channel),vertexTangents:!!b.attributes.tangent&&(ie||se),vertexColors:o.vertexColors,vertexAlphas:o.vertexColors===!0&&!!b.attributes.color&&b.attributes.color.itemSize===4,pointsUvs:v.isPoints===!0&&!!b.attributes.uv&&(te||ve),fog:!!y,useFog:o.fog===!0,fogExp2:!!y&&y.isFogExp2,flatShading:o.flatShading===!0&&o.wireframe===!1,sizeAttenuation:o.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:ee,skinning:v.isSkinnedMesh===!0,morphTargets:b.morphAttributes.position!==void 0,morphNormals:b.morphAttributes.normal!==void 0,morphColors:b.morphAttributes.color!==void 0,morphTargetsCount:E,morphTextureStride:D,numDirLights:c.directional.length,numPointLights:c.point.length,numSpotLights:c.spot.length,numSpotLightMaps:c.spotLightMap.length,numRectAreaLights:c.rectArea.length,numHemiLights:c.hemi.length,numDirLightShadows:c.directionalShadowMap.length,numPointLightShadows:c.pointShadowMap.length,numSpotLightShadows:c.spotShadowMap.length,numSpotLightShadowsWithMaps:c.numSpotLightShadowsWithMaps,numLightProbes:c.numLightProbes,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:o.dithering,shadowMapEnabled:t.shadowMap.enabled&&d.length>0,shadowMapType:t.shadowMap.type,toneMapping:Se,decodeVideoTexture:te&&o.map.isVideoTexture===!0&&V.getTransfer(o.map.colorSpace)===`srgb`,decodeVideoTextureEmissive:ae&&o.emissiveMap.isVideoTexture===!0&&V.getTransfer(o.emissiveMap.colorSpace)===`srgb`,premultipliedAlpha:o.premultipliedAlpha,doubleSided:o.side===2,flipSided:o.side===1,useDepthPacking:o.depthPacking>=0,depthPacking:o.depthPacking||0,index0AttributeName:o.index0AttributeName,extensionClipCullDistance:xe&&o.extensions.clipCullDistance===!0&&i.has(`WEBGL_clip_cull_distance`),extensionMultiDraw:(xe&&o.extensions.multiDraw===!0||P)&&i.has(`WEBGL_multi_draw`),rendererExtensionParallelShaderCompile:i.has(`KHR_parallel_shader_compile`),customProgramCacheKey:o.customProgramCacheKey()};return Ce.vertexUv1s=u.has(1),Ce.vertexUv2s=u.has(2),Ce.vertexUv3s=u.has(3),u.clear(),Ce}function b(e){let n=[];if(e.shaderID?n.push(e.shaderID):(n.push(e.customVertexShaderID),n.push(e.customFragmentShaderID)),e.defines!==void 0)for(let t in e.defines)n.push(t),n.push(e.defines[t]);return e.isRawShaderMaterial===!1&&(x(n,e),S(n,e),n.push(t.outputColorSpace)),n.push(e.customProgramCacheKey),n.join()}function x(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapCubeUVHeight),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.morphAttributeCount),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function S(e,t){c.disableAll(),t.supportsVertexTextures&&c.enable(0),t.instancing&&c.enable(1),t.instancingColor&&c.enable(2),t.instancingMorph&&c.enable(3),t.matcap&&c.enable(4),t.envMap&&c.enable(5),t.normalMapObjectSpace&&c.enable(6),t.normalMapTangentSpace&&c.enable(7),t.clearcoat&&c.enable(8),t.iridescence&&c.enable(9),t.alphaTest&&c.enable(10),t.vertexColors&&c.enable(11),t.vertexAlphas&&c.enable(12),t.vertexUv1s&&c.enable(13),t.vertexUv2s&&c.enable(14),t.vertexUv3s&&c.enable(15),t.vertexTangents&&c.enable(16),t.anisotropy&&c.enable(17),t.alphaHash&&c.enable(18),t.batching&&c.enable(19),t.dispersion&&c.enable(20),t.batchingColor&&c.enable(21),t.gradientMap&&c.enable(22),e.push(c.mask),c.disableAll(),t.fog&&c.enable(0),t.useFog&&c.enable(1),t.flatShading&&c.enable(2),t.logarithmicDepthBuffer&&c.enable(3),t.reversedDepthBuffer&&c.enable(4),t.skinning&&c.enable(5),t.morphTargets&&c.enable(6),t.morphNormals&&c.enable(7),t.morphColors&&c.enable(8),t.premultipliedAlpha&&c.enable(9),t.shadowMapEnabled&&c.enable(10),t.doubleSided&&c.enable(11),t.flipSided&&c.enable(12),t.useDepthPacking&&c.enable(13),t.dithering&&c.enable(14),t.transmission&&c.enable(15),t.sheen&&c.enable(16),t.opaque&&c.enable(17),t.pointsUvs&&c.enable(18),t.decodeVideoTexture&&c.enable(19),t.decodeVideoTextureEmissive&&c.enable(20),t.alphaToCoverage&&c.enable(21),e.push(c.mask)}function C(e){let t=h[e.type],n;if(t){let e=$e[t];n=_.clone(e.uniforms)}else n=e.uniforms;return n}function w(e,n){let r;for(let e=0,t=d.length;e<t;e++){let t=d[e];if(t.cacheKey===n){r=t,++r.usedTimes;break}}return r===void 0&&(r=new xr(t,n,e,o),d.push(r)),r}function T(e){if(--e.usedTimes===0){let t=d.indexOf(e);d[t]=d[d.length-1],d.pop(),e.destroy()}}function E(e){l.remove(e)}function D(){l.dispose()}return{getParameters:v,getProgramCacheKey:b,getUniforms:C,acquireProgram:w,releaseProgram:T,releaseShaderCache:E,programs:d,dispose:D}}function Er(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function r(t){e.delete(t)}function i(t,n,r){e.get(t)[n]=r}function a(){e=new WeakMap}return{has:t,get:n,remove:r,update:i,dispose:a}}function Dr(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.z===t.z?e.id-t.id:e.z-t.z:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function Or(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function kr(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(n,r,i,a,o,s){let c=e[t];return c===void 0?(c={id:n.id,object:n,geometry:r,material:i,groupOrder:a,renderOrder:n.renderOrder,z:o,group:s},e[t]=c):(c.id=n.id,c.object=n,c.geometry=r,c.material=i,c.groupOrder=a,c.renderOrder=n.renderOrder,c.z=o,c.group=s),t++,c}function s(e,t,a,s,c,l){let u=o(e,t,a,s,c,l);a.transmission>0?r.push(u):a.transparent===!0?i.push(u):n.push(u)}function c(e,t,a,s,c,l){let u=o(e,t,a,s,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function l(e,t){n.length>1&&n.sort(e||Dr),r.length>1&&r.sort(t||Or),i.length>1&&i.sort(t||Or)}function u(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:s,unshift:c,finish:u,sort:l}}function Ar(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new kr,e.set(t,[i])):n>=r.length?(i=new kr,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function jr(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`DirectionalLight`:n={direction:new b,color:new U};break;case`SpotLight`:n={position:new b,direction:new b,color:new U,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new b,color:new U,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new b,skyColor:new U,groundColor:new U};break;case`RectAreaLight`:n={color:new U,position:new b,halfWidth:new b,halfHeight:new b}}return e[t.id]=n,n}}}function Mr(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`DirectionalLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new m};break;case`SpotLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new m};break;case`PointLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new m,shadowCameraNear:1,shadowCameraFar:1e3}}return e[t.id]=n,n}}}var Nr=0;function Pr(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function Fr(e){let t=new jr,n=Mr(),r={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)r.probe.push(new b);let i=new b,a=new oe,o=new oe;function s(i){let a=0,o=0,s=0;for(let e=0;e<9;e++)r.probe[e].set(0,0,0);let c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0;i.sort(Pr);for(let e=0,y=i.length;e<y;e++){let y=i[e],b=y.color,x=y.intensity,S=y.distance,C=y.shadow&&y.shadow.map?y.shadow.map.texture:null;if(y.isAmbientLight)a+=b.r*x,o+=b.g*x,s+=b.b*x;else if(y.isLightProbe){for(let e=0;e<9;e++)r.probe[e].addScaledVector(y.sh.coefficients[e],x);v++}else if(y.isDirectionalLight){let e=t.get(y);if(e.color.copy(y.color).multiplyScalar(y.intensity),y.castShadow){let e=y.shadow,t=n.get(y);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,r.directionalShadow[c]=t,r.directionalShadowMap[c]=C,r.directionalShadowMatrix[c]=y.shadow.matrix,p++}r.directional[c]=e,c++}else if(y.isSpotLight){let e=t.get(y);e.position.setFromMatrixPosition(y.matrixWorld),e.color.copy(b).multiplyScalar(x),e.distance=S,e.coneCos=Math.cos(y.angle),e.penumbraCos=Math.cos(y.angle*(1-y.penumbra)),e.decay=y.decay,r.spot[u]=e;let i=y.shadow;if(y.map&&(r.spotLightMap[g]=y.map,g++,i.updateMatrices(y),y.castShadow&&_++),r.spotLightMatrix[u]=i.matrix,y.castShadow){let e=n.get(y);e.shadowIntensity=i.intensity,e.shadowBias=i.bias,e.shadowNormalBias=i.normalBias,e.shadowRadius=i.radius,e.shadowMapSize=i.mapSize,r.spotShadow[u]=e,r.spotShadowMap[u]=C,h++}u++}else if(y.isRectAreaLight){let e=t.get(y);e.color.copy(b).multiplyScalar(x),e.halfWidth.set(y.width*.5,0,0),e.halfHeight.set(0,y.height*.5,0),r.rectArea[d]=e,d++}else if(y.isPointLight){let e=t.get(y);if(e.color.copy(y.color).multiplyScalar(y.intensity),e.distance=y.distance,e.decay=y.decay,y.castShadow){let e=y.shadow,t=n.get(y);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,r.pointShadow[l]=t,r.pointShadowMap[l]=C,r.pointShadowMatrix[l]=y.shadow.matrix,m++}r.point[l]=e,l++}else if(y.isHemisphereLight){let e=t.get(y);e.skyColor.copy(y.color).multiplyScalar(x),e.groundColor.copy(y.groundColor).multiplyScalar(x),r.hemi[f]=e,f++}}d>0&&(e.has(`OES_texture_float_linear`)===!0?(r.rectAreaLTC1=$.LTC_FLOAT_1,r.rectAreaLTC2=$.LTC_FLOAT_2):(r.rectAreaLTC1=$.LTC_HALF_1,r.rectAreaLTC2=$.LTC_HALF_2)),r.ambient[0]=a,r.ambient[1]=o,r.ambient[2]=s;let y=r.hash;(y.directionalLength!==c||y.pointLength!==l||y.spotLength!==u||y.rectAreaLength!==d||y.hemiLength!==f||y.numDirectionalShadows!==p||y.numPointShadows!==m||y.numSpotShadows!==h||y.numSpotMaps!==g||y.numLightProbes!==v)&&(r.directional.length=c,r.spot.length=u,r.rectArea.length=d,r.point.length=l,r.hemi.length=f,r.directionalShadow.length=p,r.directionalShadowMap.length=p,r.pointShadow.length=m,r.pointShadowMap.length=m,r.spotShadow.length=h,r.spotShadowMap.length=h,r.directionalShadowMatrix.length=p,r.pointShadowMatrix.length=m,r.spotLightMatrix.length=h+g-_,r.spotLightMap.length=g,r.numSpotLightShadowsWithMaps=_,r.numLightProbes=v,y.directionalLength=c,y.pointLength=l,y.spotLength=u,y.rectAreaLength=d,y.hemiLength=f,y.numDirectionalShadows=p,y.numPointShadows=m,y.numSpotShadows=h,y.numSpotMaps=g,y.numLightProbes=v,r.version=Nr++)}function c(e,t){let n=0,s=0,c=0,l=0,u=0,d=t.matrixWorldInverse;for(let t=0,f=e.length;t<f;t++){let f=e[t];if(f.isDirectionalLight){let e=r.directional[n];e.direction.setFromMatrixPosition(f.matrixWorld),i.setFromMatrixPosition(f.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(d),n++}else if(f.isSpotLight){let e=r.spot[c];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),e.direction.setFromMatrixPosition(f.matrixWorld),i.setFromMatrixPosition(f.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(d),c++}else if(f.isRectAreaLight){let e=r.rectArea[l];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),o.identity(),a.copy(f.matrixWorld),a.premultiply(d),o.extractRotation(a),e.halfWidth.set(f.width*.5,0,0),e.halfHeight.set(0,f.height*.5,0),e.halfWidth.applyMatrix4(o),e.halfHeight.applyMatrix4(o),l++}else if(f.isPointLight){let e=r.point[s];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),s++}else if(f.isHemisphereLight){let e=r.hemi[u];e.direction.setFromMatrixPosition(f.matrixWorld),e.direction.transformDirection(d),u++}}}return{setup:s,setupView:c,state:r}}function Ir(e){let t=new Fr(e),n=[],r=[];function i(e){l.camera=e,n.length=0,r.length=0}function a(e){n.push(e)}function o(e){r.push(e)}function s(){t.setup(n)}function c(e){t.setupView(n,e)}let l={lightsArray:n,shadowsArray:r,camera:null,lights:t,transmissionRenderTarget:{}};return{init:i,state:l,setupLights:s,setupLightsView:c,pushLight:a,pushShadow:o}}function Lr(e){let t=new WeakMap;function n(n,r=0){let i=t.get(n),a;return i===void 0?(a=new Ir(e),t.set(n,[a])):r>=i.length?(a=new Ir(e),i.push(a)):a=i[r],a}function r(){t=new WeakMap}return{get:n,dispose:r}}var Rr=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,zr=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Br(e,t,n){let r=new x,a=new m,o=new m,s=new De,c=new le({depthPacking:i}),l=new ye,u={},d=n.maxTextureSize,f={0:1,1:0,2:2},p=new He({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new m},radius:{value:4}},vertexShader:Rr,fragmentShader:zr}),h=p.clone();h.defines.HORIZONTAL_PASS=1;let g=new Ae;g.setAttribute(`position`,new Ce(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new X(g,p),v=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let y=this.type;this.render=function(t,n,i){if(v.enabled===!1||v.autoUpdate===!1&&v.needsUpdate===!1||t.length===0)return;let c=e.getRenderTarget(),l=e.getActiveCubeFace(),u=e.getActiveMipmapLevel(),f=e.state;f.setBlending(0),f.buffers.depth.getReversed()===!0?f.buffers.color.setClear(0,0,0,0):f.buffers.color.setClear(1,1,1,1),f.buffers.depth.setTest(!0),f.setScissorTest(!1);let p=y!==3&&this.type===3,m=y===3&&this.type!==3;for(let c=0,l=t.length;c<l;c++){let l=t[c],u=l.shadow;if(u===void 0){console.warn(`THREE.WebGLShadowMap:`,l,`has no shadow.`);continue}if(u.autoUpdate===!1&&u.needsUpdate===!1)continue;a.copy(u.mapSize);let h=u.getFrameExtents();if(a.multiply(h),o.copy(u.mapSize),(a.x>d||a.y>d)&&(a.x>d&&(o.x=Math.floor(d/h.x),a.x=o.x*h.x,u.mapSize.x=o.x),a.y>d&&(o.y=Math.floor(d/h.y),a.y=o.y*h.y,u.mapSize.y=o.y)),u.map===null||p===!0||m===!0){let e=this.type===3?{}:{minFilter:be,magFilter:be};u.map!==null&&u.map.dispose(),u.map=new R(a.x,a.y,e),u.map.texture.name=l.name+`.shadowMap`,u.camera.updateProjectionMatrix()}e.setRenderTarget(u.map),e.clear();let g=u.getViewportCount();for(let e=0;e<g;e++){let t=u.getViewport(e);s.set(o.x*t.x,o.y*t.y,o.x*t.z,o.y*t.w),f.viewport(s),u.updateMatrices(l,e),r=u.getFrustum(),C(n,i,u.camera,l,this.type)}u.isPointLightShadow!==!0&&this.type===3&&b(u,i),u.needsUpdate=!1}y=this.type,v.needsUpdate=!1,e.setRenderTarget(c,l,u)};function b(n,r){let i=t.update(_);p.defines.VSM_SAMPLES!==n.blurSamples&&(p.defines.VSM_SAMPLES=n.blurSamples,h.defines.VSM_SAMPLES=n.blurSamples,p.needsUpdate=!0,h.needsUpdate=!0),n.mapPass===null&&(n.mapPass=new R(a.x,a.y)),p.uniforms.shadow_pass.value=n.map.texture,p.uniforms.resolution.value=n.mapSize,p.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,i,p,_,null),h.uniforms.shadow_pass.value=n.mapPass.texture,h.uniforms.resolution.value=n.mapSize,h.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,i,h,_,null)}function S(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?l:c,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0||n.alphaToCoverage===!0){let e=a.uuid,t=n.uuid,r=u[e];r===void 0&&(r={},u[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,w)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?f[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaToCoverage===!0?.5:n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function C(n,i,a,o,s){if(n.visible===!1)return;if(n.layers.test(i.layers)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&s===3)&&(!n.frustumCulled||r.intersectsObject(n))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let r=t.update(n),c=n.material;if(Array.isArray(c)){let t=r.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=c[u.materialIndex];if(d&&d.visible){let t=S(n,d,o,s);n.onBeforeShadow(e,n,i,a,r,t,u),e.renderBufferDirect(a,null,r,t,n,u),n.onAfterShadow(e,n,i,a,r,t,u)}}}else if(c.visible){let t=S(n,c,o,s);n.onBeforeShadow(e,n,i,a,r,t,null),e.renderBufferDirect(a,null,r,t,n,null),n.onAfterShadow(e,n,i,a,r,t,null)}}let c=n.children;for(let e=0,t=c.length;e<t;e++)C(c[e],i,a,o,s)}function w(e){e.target.removeEventListener(`dispose`,w);for(let t in u){let n=u[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}var Vr={0:1,2:6,4:7,3:5,1:0,6:2,7:4,5:3};function Hr(e,t){function n(){let t=!1,n=new De,r=null,i=new De(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function r(){let n=!1,r=!1,i=null,a=null,o=null;return{setReversed:function(e){if(r!==e){let n=t.get(`EXT_clip_control`);e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),r=e;let i=o;o=null,this.setClear(i)}},getReversed:function(){return r},setTest:function(t){t?R(e.DEPTH_TEST):ae(e.DEPTH_TEST)},setMask:function(t){i!==t&&!n&&(e.depthMask(t),i=t)},setFunc:function(t){if(r&&(t=Vr[t]),a!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}a=t}},setLocked:function(e){n=e},setClear:function(t){o!==t&&(r&&(t=1-t),e.clearDepth(t),o=t)},reset:function(){n=!1,i=null,a=null,o=null,r=!1}}}function i(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?R(e.STENCIL_TEST):ae(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let a=new n,o=new r,s=new i,c=new WeakMap,l=new WeakMap,u={},d={},f=new WeakMap,p=[],m=null,h=!1,g=null,_=null,v=null,y=null,b=null,x=null,S=null,C=new U(0,0,0),w=0,T=!1,E=null,D=null,O=null,k=null,A=null,j=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),M=!1,ee=0,N=e.getParameter(e.VERSION);N.indexOf(`WebGL`)===-1?N.indexOf(`OpenGL ES`)!==-1&&(ee=parseFloat(/^OpenGL ES (\d)/.exec(N)[1]),M=ee>=2):(ee=parseFloat(/^WebGL (\d)/.exec(N)[1]),M=ee>=1);let P=null,te={},F=e.getParameter(e.SCISSOR_BOX),I=e.getParameter(e.VIEWPORT),L=new De().fromArray(F),ne=new De().fromArray(I);function re(t,n,r,i){let a=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,i,0,e.RGBA,e.UNSIGNED_BYTE,a):e.texImage2D(n+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,a);return o}let ie={};ie[e.TEXTURE_2D]=re(e.TEXTURE_2D,e.TEXTURE_2D,1),ie[e.TEXTURE_CUBE_MAP]=re(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),ie[e.TEXTURE_2D_ARRAY]=re(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),ie[e.TEXTURE_3D]=re(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),R(e.DEPTH_TEST),o.setFunc(3),de(!1),fe(1),R(e.CULL_FACE),le(0);function R(t){u[t]!==!0&&(e.enable(t),u[t]=!0)}function ae(t){u[t]!==!1&&(e.disable(t),u[t]=!1)}function z(t,n){return d[t]!==n&&(e.bindFramebuffer(t,n),d[t]=n,t===e.DRAW_FRAMEBUFFER&&(d[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(d[e.DRAW_FRAMEBUFFER]=n),!0)}function oe(t,n){let r=p,i=!1;if(t){r=f.get(n),r===void 0&&(r=[],f.set(n,r));let a=t.textures;if(r.length!==a.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=a.length;t<n;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=a.length,i=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,i=!0);i&&e.drawBuffers(r)}function se(t){return m!==t&&(e.useProgram(t),m=t,!0)}let B={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};B[103]=e.MIN,B[104]=e.MAX;let ce={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function le(t,n,r,i,a,o,s,c,l,u){if(t===0)h===!0&&(ae(e.BLEND),h=!1);else if(h===!1&&(R(e.BLEND),h=!0),t!==5){if(t!==g||u!==T){if((_!==100||b!==100)&&(e.blendEquation(e.FUNC_ADD),_=100,b=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:console.error(`THREE.WebGLState: Invalid blending: `,t)}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case 3:console.error(`THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);break;case 4:console.error(`THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);break;default:console.error(`THREE.WebGLState: Invalid blending: `,t)}v=null,y=null,x=null,S=null,C.set(0,0,0),w=0,g=t,T=u}}else a||=n,o||=r,s||=i,(n!==_||a!==b)&&(e.blendEquationSeparate(B[n],B[a]),_=n,b=a),(r!==v||i!==y||o!==x||s!==S)&&(e.blendFuncSeparate(ce[r],ce[i],ce[o],ce[s]),v=r,y=i,x=o,S=s),(c.equals(C)===!1||l!==w)&&(e.blendColor(c.r,c.g,c.b,l),C.copy(c),w=l),g=t,T=!1}function ue(t,n){t.side===2?ae(e.CULL_FACE):R(e.CULL_FACE);let r=t.side===1;n&&(r=!r),de(r),t.blending===1&&t.transparent===!1?le(0):le(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),o.setFunc(t.depthFunc),o.setTest(t.depthTest),o.setMask(t.depthWrite),a.setMask(t.colorWrite);let i=t.stencilWrite;s.setTest(i),i&&(s.setMask(t.stencilWriteMask),s.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),s.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),me(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?R(e.SAMPLE_ALPHA_TO_COVERAGE):ae(e.SAMPLE_ALPHA_TO_COVERAGE)}function de(t){E!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),E=t)}function fe(t){t===0?ae(e.CULL_FACE):(R(e.CULL_FACE),t!==D&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),D=t}function pe(t){t!==O&&(M&&e.lineWidth(t),O=t)}function me(t,n,r){t?(R(e.POLYGON_OFFSET_FILL),(k!==n||A!==r)&&(e.polygonOffset(n,r),k=n,A=r)):ae(e.POLYGON_OFFSET_FILL)}function he(t){t?R(e.SCISSOR_TEST):ae(e.SCISSOR_TEST)}function V(t){t===void 0&&(t=e.TEXTURE0+j-1),P!==t&&(e.activeTexture(t),P=t)}function H(t,n,r){r===void 0&&(r=P===null?e.TEXTURE0+j-1:P);let i=te[r];i===void 0&&(i={type:void 0,texture:void 0},te[r]=i),(i.type!==t||i.texture!==n)&&(P!==r&&(e.activeTexture(r),P=r),e.bindTexture(t,n||ie[t]),i.type=t,i.texture=n)}function ge(){let t=te[P];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function W(){try{e.compressedTexImage2D(...arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function G(){try{e.compressedTexImage3D(...arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function K(){try{e.texSubImage2D(...arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function q(){try{e.texSubImage3D(...arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function J(){try{e.compressedTexSubImage2D(...arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function Y(){try{e.compressedTexSubImage3D(...arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function _e(){try{e.texStorage2D(...arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function ve(){try{e.texStorage3D(...arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function ye(){try{e.texImage2D(...arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function be(){try{e.texImage3D(...arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function xe(t){L.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),L.copy(t))}function Se(t){ne.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),ne.copy(t))}function Ce(t,n){let r=l.get(n);r===void 0&&(r=new WeakMap,l.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),r.set(t,i))}function we(t,n){let r=l.get(n).get(t);c.get(n)!==r&&(e.uniformBlockBinding(n,r,t.__bindingPointIndex),c.set(n,r))}function X(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),u={},P=null,te={},d={},f=new WeakMap,p=[],m=null,h=!1,g=null,_=null,v=null,y=null,b=null,x=null,S=null,C=new U(0,0,0),w=0,T=!1,E=null,D=null,O=null,k=null,A=null,L.set(0,0,e.canvas.width,e.canvas.height),ne.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:R,disable:ae,bindFramebuffer:z,drawBuffers:oe,useProgram:se,setBlending:le,setMaterial:ue,setFlipSided:de,setCullFace:fe,setLineWidth:pe,setPolygonOffset:me,setScissorTest:he,activeTexture:V,bindTexture:H,unbindTexture:ge,compressedTexImage2D:W,compressedTexImage3D:G,texImage2D:ye,texImage3D:be,updateUBOMapping:Ce,uniformBlockBinding:we,texStorage2D:_e,texStorage3D:ve,texSubImage2D:K,texSubImage3D:q,compressedTexSubImage2D:J,compressedTexSubImage3D:Y,scissor:xe,viewport:Se,reset:X}}function Ur(e,t,n,r,i,a,o){let s=t.has(`WEBGL_multisampled_render_to_texture`)?t.get(`WEBGL_multisampled_render_to_texture`):null,c=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),l=new m,u=new WeakMap,d,f=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function h(e,t){return p?new OffscreenCanvas(e,t):Se(`canvas`)}function g(e,t,n){let r=1,i=_e(e);if((i.width>n||i.height>n)&&(r=n/Math.max(i.width,i.height)),r<1){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof VideoFrame<`u`&&e instanceof VideoFrame){let n=Math.floor(r*i.width),a=Math.floor(r*i.height);d===void 0&&(d=h(n,a));let o=t?h(n,a):d;return o.width=n,o.height=a,o.getContext(`2d`).drawImage(e,0,0,n,a),console.warn(`THREE.WebGLRenderer: Texture has been resized from (`+i.width+`x`+i.height+`) to (`+n+`x`+a+`).`),o}return`data`in e&&console.warn(`THREE.WebGLRenderer: Image in DataTexture is too big (`+i.width+`x`+i.height+`).`),e}return e}function _(e){return e.generateMipmaps}function v(t){e.generateMipmap(t)}function y(t){return t.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:t.isWebGL3DRenderTarget?e.TEXTURE_3D:t.isWebGLArrayRenderTarget||t.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function b(n,r,i,a,o=!1){if(n!==null){if(e[n]!==void 0)return e[n];console.warn(`THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '`+n+`'`)}let s=r;if(r===e.RED&&(i===e.FLOAT&&(s=e.R32F),i===e.HALF_FLOAT&&(s=e.R16F),i===e.UNSIGNED_BYTE&&(s=e.R8)),r===e.RED_INTEGER&&(i===e.UNSIGNED_BYTE&&(s=e.R8UI),i===e.UNSIGNED_SHORT&&(s=e.R16UI),i===e.UNSIGNED_INT&&(s=e.R32UI),i===e.BYTE&&(s=e.R8I),i===e.SHORT&&(s=e.R16I),i===e.INT&&(s=e.R32I)),r===e.RG&&(i===e.FLOAT&&(s=e.RG32F),i===e.HALF_FLOAT&&(s=e.RG16F),i===e.UNSIGNED_BYTE&&(s=e.RG8)),r===e.RG_INTEGER&&(i===e.UNSIGNED_BYTE&&(s=e.RG8UI),i===e.UNSIGNED_SHORT&&(s=e.RG16UI),i===e.UNSIGNED_INT&&(s=e.RG32UI),i===e.BYTE&&(s=e.RG8I),i===e.SHORT&&(s=e.RG16I),i===e.INT&&(s=e.RG32I)),r===e.RGB_INTEGER&&(i===e.UNSIGNED_BYTE&&(s=e.RGB8UI),i===e.UNSIGNED_SHORT&&(s=e.RGB16UI),i===e.UNSIGNED_INT&&(s=e.RGB32UI),i===e.BYTE&&(s=e.RGB8I),i===e.SHORT&&(s=e.RGB16I),i===e.INT&&(s=e.RGB32I)),r===e.RGBA_INTEGER&&(i===e.UNSIGNED_BYTE&&(s=e.RGBA8UI),i===e.UNSIGNED_SHORT&&(s=e.RGBA16UI),i===e.UNSIGNED_INT&&(s=e.RGBA32UI),i===e.BYTE&&(s=e.RGBA8I),i===e.SHORT&&(s=e.RGBA16I),i===e.INT&&(s=e.RGBA32I)),r===e.RGB&&(i===e.UNSIGNED_INT_5_9_9_9_REV&&(s=e.RGB9_E5),i===e.UNSIGNED_INT_10F_11F_11F_REV&&(s=e.R11F_G11F_B10F)),r===e.RGBA){let t=o?pe:V.getTransfer(a);i===e.FLOAT&&(s=e.RGBA32F),i===e.HALF_FLOAT&&(s=e.RGBA16F),i===e.UNSIGNED_BYTE&&(s=t===`srgb`?e.SRGB8_ALPHA8:e.RGBA8),i===e.UNSIGNED_SHORT_4_4_4_4&&(s=e.RGBA4),i===e.UNSIGNED_SHORT_5_5_5_1&&(s=e.RGB5_A1)}return(s===e.R16F||s===e.R32F||s===e.RG16F||s===e.RG32F||s===e.RGBA16F||s===e.RGBA32F)&&t.get(`EXT_color_buffer_float`),s}function x(t,n){let r;return t?n===null||n===1014||n===1020?r=e.DEPTH24_STENCIL8:n===1015?r=e.DEPTH32F_STENCIL8:n===1012&&(r=e.DEPTH24_STENCIL8,console.warn(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)):n===null||n===1014||n===1020?r=e.DEPTH_COMPONENT24:n===1015?r=e.DEPTH_COMPONENT32F:n===1012&&(r=e.DEPTH_COMPONENT16),r}function S(e,t){return _(e)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps!==void 0&&e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function C(e){let t=e.target;t.removeEventListener(`dispose`,C),T(t),t.isVideoTexture&&u.delete(t)}function w(e){let t=e.target;t.removeEventListener(`dispose`,w),D(t)}function T(e){let t=r.get(e);if(t.__webglInit===void 0)return;let n=e.source,i=f.get(n);if(i){let r=i[t.__cacheKey];r.usedTimes--,r.usedTimes===0&&E(e),Object.keys(i).length===0&&f.delete(n)}r.remove(e)}function E(t){let n=r.get(t);e.deleteTexture(n.__webglTexture);let i=t.source,a=f.get(i);delete a[n.__cacheKey],o.memory.textures--}function D(t){let n=r.get(t);if(t.depthTexture&&(t.depthTexture.dispose(),r.remove(t.depthTexture)),t.isWebGLCubeRenderTarget)for(let t=0;t<6;t++){if(Array.isArray(n.__webglFramebuffer[t]))for(let r=0;r<n.__webglFramebuffer[t].length;r++)e.deleteFramebuffer(n.__webglFramebuffer[t][r]);else e.deleteFramebuffer(n.__webglFramebuffer[t]);n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer[t])}else{if(Array.isArray(n.__webglFramebuffer))for(let t=0;t<n.__webglFramebuffer.length;t++)e.deleteFramebuffer(n.__webglFramebuffer[t]);else e.deleteFramebuffer(n.__webglFramebuffer);if(n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer),n.__webglMultisampledFramebuffer&&e.deleteFramebuffer(n.__webglMultisampledFramebuffer),n.__webglColorRenderbuffer)for(let t=0;t<n.__webglColorRenderbuffer.length;t++)n.__webglColorRenderbuffer[t]&&e.deleteRenderbuffer(n.__webglColorRenderbuffer[t]);n.__webglDepthRenderbuffer&&e.deleteRenderbuffer(n.__webglDepthRenderbuffer)}let i=t.textures;for(let t=0,n=i.length;t<n;t++){let n=r.get(i[t]);n.__webglTexture&&(e.deleteTexture(n.__webglTexture),o.memory.textures--),r.remove(i[t])}r.remove(t)}let O=0;function A(){O=0}function j(){let e=O;return e>=i.maxTextures&&console.warn(`THREE.WebGLTextures: Trying to use `+e+` texture units while this GPU supports only `+i.maxTextures),O+=1,e}function M(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function ee(t,i){let a=r.get(t);if(t.isVideoTexture&&J(t),t.isRenderTargetTexture===!1&&t.isExternalTexture!==!0&&t.version>0&&a.__version!==t.version){let e=t.image;if(e===null)console.warn(`THREE.WebGLRenderer: Texture marked for update but no image data found.`);else if(e.complete===!1)console.warn(`THREE.WebGLRenderer: Texture marked for update but image is incomplete`);else{oe(a,t,i);return}}else t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null);n.bindTexture(e.TEXTURE_2D,a.__webglTexture,e.TEXTURE0+i)}function N(t,i){let a=r.get(t);t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version?oe(a,t,i):n.bindTexture(e.TEXTURE_2D_ARRAY,a.__webglTexture,e.TEXTURE0+i)}function P(t,i){let a=r.get(t);t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version?oe(a,t,i):n.bindTexture(e.TEXTURE_3D,a.__webglTexture,e.TEXTURE0+i)}function te(t,i){let a=r.get(t);t.version>0&&a.__version!==t.version?se(a,t,i):n.bindTexture(e.TEXTURE_CUBE_MAP,a.__webglTexture,e.TEXTURE0+i)}let F={[ge]:e.REPEAT,[Te]:e.CLAMP_TO_EDGE,[Ee]:e.MIRRORED_REPEAT},L={[be]:e.NEAREST,[H]:e.NEAREST_MIPMAP_NEAREST,[W]:e.NEAREST_MIPMAP_LINEAR,[I]:e.LINEAR,[k]:e.LINEAR_MIPMAP_NEAREST,[ie]:e.LINEAR_MIPMAP_LINEAR},ne={512:e.NEVER,519:e.ALWAYS,513:e.LESS,515:e.LEQUAL,514:e.EQUAL,518:e.GEQUAL,516:e.GREATER,517:e.NOTEQUAL};function re(n,a){if(a.type===1015&&t.has(`OES_texture_float_linear`)===!1&&(a.magFilter===1006||a.magFilter===1007||a.magFilter===1005||a.magFilter===1008||a.minFilter===1006||a.minFilter===1007||a.minFilter===1005||a.minFilter===1008)&&console.warn(`THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`),e.texParameteri(n,e.TEXTURE_WRAP_S,F[a.wrapS]),e.texParameteri(n,e.TEXTURE_WRAP_T,F[a.wrapT]),(n===e.TEXTURE_3D||n===e.TEXTURE_2D_ARRAY)&&e.texParameteri(n,e.TEXTURE_WRAP_R,F[a.wrapR]),e.texParameteri(n,e.TEXTURE_MAG_FILTER,L[a.magFilter]),e.texParameteri(n,e.TEXTURE_MIN_FILTER,L[a.minFilter]),a.compareFunction&&(e.texParameteri(n,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(n,e.TEXTURE_COMPARE_FUNC,ne[a.compareFunction])),t.has(`EXT_texture_filter_anisotropic`)===!0){if(a.magFilter===1003||a.minFilter!==1005&&a.minFilter!==1008||a.type===1015&&t.has(`OES_texture_float_linear`)===!1)return;if(a.anisotropy>1||r.get(a).__currentAnisotropy){let o=t.get(`EXT_texture_filter_anisotropic`);e.texParameterf(n,o.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(a.anisotropy,i.getMaxAnisotropy())),r.get(a).__currentAnisotropy=a.anisotropy}}}function R(t,n){let r=!1;t.__webglInit===void 0&&(t.__webglInit=!0,n.addEventListener(`dispose`,C));let i=n.source,a=f.get(i);a===void 0&&(a={},f.set(i,a));let s=M(n);if(s!==t.__cacheKey){a[s]===void 0&&(a[s]={texture:e.createTexture(),usedTimes:0},o.memory.textures++,r=!0),a[s].usedTimes++;let i=a[t.__cacheKey];i!==void 0&&(a[t.__cacheKey].usedTimes--,i.usedTimes===0&&E(n)),t.__cacheKey=s,t.__webglTexture=a[s].texture}return r}function ae(e,t,n){return Math.floor(Math.floor(e/n)/t)}function z(t,r,i,a){let o=t.updateRanges;if(o.length===0)n.texSubImage2D(e.TEXTURE_2D,0,0,0,r.width,r.height,i,a,r.data);else{o.sort((e,t)=>e.start-t.start);let s=0;for(let e=1;e<o.length;e++){let t=o[s],n=o[e],i=t.start+t.count,a=ae(n.start,r.width,4),c=ae(t.start,r.width,4);n.start<=i+1&&a===c&&ae(n.start+n.count-1,r.width,4)===a?t.count=Math.max(t.count,n.start+n.count-t.start):(++s,o[s]=n)}o.length=s+1;let c=e.getParameter(e.UNPACK_ROW_LENGTH),l=e.getParameter(e.UNPACK_SKIP_PIXELS),u=e.getParameter(e.UNPACK_SKIP_ROWS);e.pixelStorei(e.UNPACK_ROW_LENGTH,r.width);for(let t=0,s=o.length;t<s;t++){let s=o[t],c=Math.floor(s.start/4),l=Math.ceil(s.count/4),u=c%r.width,d=Math.floor(c/r.width),f=l;e.pixelStorei(e.UNPACK_SKIP_PIXELS,u),e.pixelStorei(e.UNPACK_SKIP_ROWS,d),n.texSubImage2D(e.TEXTURE_2D,0,u,d,f,1,i,a,r.data)}t.clearUpdateRanges(),e.pixelStorei(e.UNPACK_ROW_LENGTH,c),e.pixelStorei(e.UNPACK_SKIP_PIXELS,l),e.pixelStorei(e.UNPACK_SKIP_ROWS,u)}}function oe(t,o,s){let c=e.TEXTURE_2D;(o.isDataArrayTexture||o.isCompressedArrayTexture)&&(c=e.TEXTURE_2D_ARRAY),o.isData3DTexture&&(c=e.TEXTURE_3D);let l=R(t,o),u=o.source;n.bindTexture(c,t.__webglTexture,e.TEXTURE0+s);let d=r.get(u);if(u.version!==d.__version||l===!0){n.activeTexture(e.TEXTURE0+s);let t=V.getPrimaries(V.workingColorSpace),r=o.colorSpace===``?null:V.getPrimaries(o.colorSpace),f=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),e.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,f);let p=g(o.image,!1,i.maxTextureSize);p=Y(o,p);let m=a.convert(o.format,o.colorSpace),h=a.convert(o.type),y=b(o.internalFormat,m,h,o.colorSpace,o.isVideoTexture);re(c,o);let C,w=o.mipmaps,T=o.isVideoTexture!==!0,E=d.__version===void 0||l===!0,D=u.dataReady,O=S(o,p);if(o.isDepthTexture)y=x(o.format===Re,o.type),E&&(T?n.texStorage2D(e.TEXTURE_2D,1,y,p.width,p.height):n.texImage2D(e.TEXTURE_2D,0,y,p.width,p.height,0,m,h,null));else if(o.isDataTexture){if(w.length>0){T&&E&&n.texStorage2D(e.TEXTURE_2D,O,y,w[0].width,w[0].height);for(let t=0,r=w.length;t<r;t++)C=w[t],T?D&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,C.width,C.height,m,h,C.data):n.texImage2D(e.TEXTURE_2D,t,y,C.width,C.height,0,m,h,C.data);o.generateMipmaps=!1}else T?(E&&n.texStorage2D(e.TEXTURE_2D,O,y,p.width,p.height),D&&z(o,p,m,h)):n.texImage2D(e.TEXTURE_2D,0,y,p.width,p.height,0,m,h,p.data)}else if(o.isCompressedTexture){if(o.isCompressedArrayTexture){T&&E&&n.texStorage3D(e.TEXTURE_2D_ARRAY,O,y,w[0].width,w[0].height,p.depth);for(let t=0,r=w.length;t<r;t++)if(C=w[t],o.format!==1023){if(m!==null){if(T){if(D){if(o.layerUpdates.size>0){let r=ke(C.width,C.height,o.format,o.type);for(let i of o.layerUpdates){let a=C.data.subarray(i*r/C.data.BYTES_PER_ELEMENT,(i+1)*r/C.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,t,0,0,i,C.width,C.height,1,m,a)}o.clearLayerUpdates()}else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,t,0,0,0,C.width,C.height,p.depth,m,C.data)}}else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,t,y,C.width,C.height,p.depth,0,C.data,0,0)}else console.warn(`THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`)}else T?D&&n.texSubImage3D(e.TEXTURE_2D_ARRAY,t,0,0,0,C.width,C.height,p.depth,m,h,C.data):n.texImage3D(e.TEXTURE_2D_ARRAY,t,y,C.width,C.height,p.depth,0,m,h,C.data)}else{T&&E&&n.texStorage2D(e.TEXTURE_2D,O,y,w[0].width,w[0].height);for(let t=0,r=w.length;t<r;t++)C=w[t],o.format===1023?T?D&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,C.width,C.height,m,h,C.data):n.texImage2D(e.TEXTURE_2D,t,y,C.width,C.height,0,m,h,C.data):m===null?console.warn(`THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):T?D&&n.compressedTexSubImage2D(e.TEXTURE_2D,t,0,0,C.width,C.height,m,C.data):n.compressedTexImage2D(e.TEXTURE_2D,t,y,C.width,C.height,0,C.data)}}else if(o.isDataArrayTexture){if(T){if(E&&n.texStorage3D(e.TEXTURE_2D_ARRAY,O,y,p.width,p.height,p.depth),D){if(o.layerUpdates.size>0){let t=ke(p.width,p.height,o.format,o.type);for(let r of o.layerUpdates){let i=p.data.subarray(r*t/p.data.BYTES_PER_ELEMENT,(r+1)*t/p.data.BYTES_PER_ELEMENT);n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,r,p.width,p.height,1,m,h,i)}o.clearLayerUpdates()}else n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,p.width,p.height,p.depth,m,h,p.data)}}else n.texImage3D(e.TEXTURE_2D_ARRAY,0,y,p.width,p.height,p.depth,0,m,h,p.data)}else if(o.isData3DTexture)T?(E&&n.texStorage3D(e.TEXTURE_3D,O,y,p.width,p.height,p.depth),D&&n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,p.width,p.height,p.depth,m,h,p.data)):n.texImage3D(e.TEXTURE_3D,0,y,p.width,p.height,p.depth,0,m,h,p.data);else if(o.isFramebufferTexture){if(E){if(T)n.texStorage2D(e.TEXTURE_2D,O,y,p.width,p.height);else{let t=p.width,r=p.height;for(let i=0;i<O;i++)n.texImage2D(e.TEXTURE_2D,i,y,t,r,0,m,h,null),t>>=1,r>>=1}}}else if(w.length>0){if(T&&E){let t=_e(w[0]);n.texStorage2D(e.TEXTURE_2D,O,y,t.width,t.height)}for(let t=0,r=w.length;t<r;t++)C=w[t],T?D&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,m,h,C):n.texImage2D(e.TEXTURE_2D,t,y,m,h,C);o.generateMipmaps=!1}else if(T){if(E){let t=_e(p);n.texStorage2D(e.TEXTURE_2D,O,y,t.width,t.height)}D&&n.texSubImage2D(e.TEXTURE_2D,0,0,0,m,h,p)}else n.texImage2D(e.TEXTURE_2D,0,y,m,h,p);_(o)&&v(c),d.__version=u.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function se(t,o,s){if(o.image.length!==6)return;let c=R(t,o),l=o.source;n.bindTexture(e.TEXTURE_CUBE_MAP,t.__webglTexture,e.TEXTURE0+s);let u=r.get(l);if(l.version!==u.__version||c===!0){n.activeTexture(e.TEXTURE0+s);let t=V.getPrimaries(V.workingColorSpace),r=o.colorSpace===``?null:V.getPrimaries(o.colorSpace),d=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),e.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,d);let f=o.isCompressedTexture||o.image[0].isCompressedTexture,p=o.image[0]&&o.image[0].isDataTexture,m=[];for(let e=0;e<6;e++)!f&&!p?m[e]=g(o.image[e],!0,i.maxCubemapSize):m[e]=p?o.image[e].image:o.image[e],m[e]=Y(o,m[e]);let h=m[0],y=a.convert(o.format,o.colorSpace),x=a.convert(o.type),C=b(o.internalFormat,y,x,o.colorSpace),w=o.isVideoTexture!==!0,T=u.__version===void 0||c===!0,E=l.dataReady,D=S(o,h);re(e.TEXTURE_CUBE_MAP,o);let O;if(f){w&&T&&n.texStorage2D(e.TEXTURE_CUBE_MAP,D,C,h.width,h.height);for(let t=0;t<6;t++){O=m[t].mipmaps;for(let r=0;r<O.length;r++){let i=O[r];o.format===1023?w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,y,x,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,C,i.width,i.height,0,y,x,i.data):y===null?console.warn(`THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):w?E&&n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,y,i.data):n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,C,i.width,i.height,0,i.data)}}}else{if(O=o.mipmaps,w&&T){O.length>0&&D++;let t=_e(m[0]);n.texStorage2D(e.TEXTURE_CUBE_MAP,D,C,t.width,t.height)}for(let t=0;t<6;t++)if(p){w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,m[t].width,m[t].height,y,x,m[t].data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,C,m[t].width,m[t].height,0,y,x,m[t].data);for(let r=0;r<O.length;r++){let i=O[r].image[t].image;w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,i.width,i.height,y,x,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,C,i.width,i.height,0,y,x,i.data)}}else{w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,y,x,m[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,C,y,x,m[t]);for(let r=0;r<O.length;r++){let i=O[r];w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,y,x,i.image[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,C,y,x,i.image[t])}}}_(o)&&v(e.TEXTURE_CUBE_MAP),u.__version=l.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function B(t,i,o,c,l,u){let d=a.convert(o.format,o.colorSpace),f=a.convert(o.type),p=b(o.internalFormat,d,f,o.colorSpace),m=r.get(i),h=r.get(o);if(h.__renderTarget=i,!m.__hasExternalTextures){let t=Math.max(1,i.width>>u),r=Math.max(1,i.height>>u);l===e.TEXTURE_3D||l===e.TEXTURE_2D_ARRAY?n.texImage3D(l,u,p,t,r,i.depth,0,d,f,null):n.texImage2D(l,u,p,t,r,0,d,f,null)}n.bindFramebuffer(e.FRAMEBUFFER,t),q(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,c,l,h.__webglTexture,0,K(i)):(l===e.TEXTURE_2D||l>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&l<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,c,l,h.__webglTexture,u),n.bindFramebuffer(e.FRAMEBUFFER,null)}function ce(t,n,r){if(e.bindRenderbuffer(e.RENDERBUFFER,t),n.depthBuffer){let i=n.depthTexture,a=i&&i.isDepthTexture?i.type:null,o=x(n.stencilBuffer,a),c=n.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,l=K(n);q(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,l,o,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,l,o,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,o,n.width,n.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,c,e.RENDERBUFFER,t)}else{let t=n.textures;for(let i=0;i<t.length;i++){let o=t[i],c=a.convert(o.format,o.colorSpace),l=a.convert(o.type),u=b(o.internalFormat,c,l,o.colorSpace),d=K(n);r&&q(n)===!1?e.renderbufferStorageMultisample(e.RENDERBUFFER,d,u,n.width,n.height):q(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,d,u,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,u,n.width,n.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function le(t,i){if(i&&i.isWebGLCubeRenderTarget)throw Error(`Depth Texture with cube render targets is not supported`);if(n.bindFramebuffer(e.FRAMEBUFFER,t),!(i.depthTexture&&i.depthTexture.isDepthTexture))throw Error(`renderTarget.depthTexture must be an instance of THREE.DepthTexture`);let a=r.get(i.depthTexture);a.__renderTarget=i,a.__webglTexture&&i.depthTexture.image.width===i.width&&i.depthTexture.image.height===i.height||(i.depthTexture.image.width=i.width,i.depthTexture.image.height=i.height,i.depthTexture.needsUpdate=!0),ee(i.depthTexture,0);let o=a.__webglTexture,c=K(i);if(i.depthTexture.format===1026)q(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.TEXTURE_2D,o,0,c):e.framebufferTexture2D(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.TEXTURE_2D,o,0);else if(i.depthTexture.format===1027)q(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,e.DEPTH_STENCIL_ATTACHMENT,e.TEXTURE_2D,o,0,c):e.framebufferTexture2D(e.FRAMEBUFFER,e.DEPTH_STENCIL_ATTACHMENT,e.TEXTURE_2D,o,0);else throw Error(`Unknown depthTexture format`)}function ue(t){let i=r.get(t),a=t.isWebGLCubeRenderTarget===!0;if(i.__boundDepthTexture!==t.depthTexture){let e=t.depthTexture;if(i.__depthDisposeCallback&&i.__depthDisposeCallback(),e){let t=()=>{delete i.__boundDepthTexture,delete i.__depthDisposeCallback,e.removeEventListener(`dispose`,t)};e.addEventListener(`dispose`,t),i.__depthDisposeCallback=t}i.__boundDepthTexture=e}if(t.depthTexture&&!i.__autoAllocateDepthBuffer){if(a)throw Error(`target.depthTexture not supported in Cube render targets`);let e=t.texture.mipmaps;e&&e.length>0?le(i.__webglFramebuffer[0],t):le(i.__webglFramebuffer,t)}else if(a){i.__webglDepthbuffer=[];for(let r=0;r<6;r++)if(n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[r]),i.__webglDepthbuffer[r]===void 0)i.__webglDepthbuffer[r]=e.createRenderbuffer(),ce(i.__webglDepthbuffer[r],t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,a=i.__webglDepthbuffer[r];e.bindRenderbuffer(e.RENDERBUFFER,a),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,a)}}else{let r=t.texture.mipmaps;if(r&&r.length>0?n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[0]):n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer),i.__webglDepthbuffer===void 0)i.__webglDepthbuffer=e.createRenderbuffer(),ce(i.__webglDepthbuffer,t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,r=i.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,r),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,r)}}n.bindFramebuffer(e.FRAMEBUFFER,null)}function de(t,n,i){let a=r.get(t);n!==void 0&&B(a.__webglFramebuffer,t,t.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),i!==void 0&&ue(t)}function fe(t){let i=t.texture,s=r.get(t),c=r.get(i);t.addEventListener(`dispose`,w);let l=t.textures,u=t.isWebGLCubeRenderTarget===!0,d=l.length>1;if(d||(c.__webglTexture===void 0&&(c.__webglTexture=e.createTexture()),c.__version=i.version,o.memory.textures++),u){s.__webglFramebuffer=[];for(let t=0;t<6;t++)if(i.mipmaps&&i.mipmaps.length>0){s.__webglFramebuffer[t]=[];for(let n=0;n<i.mipmaps.length;n++)s.__webglFramebuffer[t][n]=e.createFramebuffer()}else s.__webglFramebuffer[t]=e.createFramebuffer()}else{if(i.mipmaps&&i.mipmaps.length>0){s.__webglFramebuffer=[];for(let t=0;t<i.mipmaps.length;t++)s.__webglFramebuffer[t]=e.createFramebuffer()}else s.__webglFramebuffer=e.createFramebuffer();if(d)for(let t=0,n=l.length;t<n;t++){let n=r.get(l[t]);n.__webglTexture===void 0&&(n.__webglTexture=e.createTexture(),o.memory.textures++)}if(t.samples>0&&q(t)===!1){s.__webglMultisampledFramebuffer=e.createFramebuffer(),s.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,s.__webglMultisampledFramebuffer);for(let n=0;n<l.length;n++){let r=l[n];s.__webglColorRenderbuffer[n]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,s.__webglColorRenderbuffer[n]);let i=a.convert(r.format,r.colorSpace),o=a.convert(r.type),c=b(r.internalFormat,i,o,r.colorSpace,t.isXRRenderTarget===!0),u=K(t);e.renderbufferStorageMultisample(e.RENDERBUFFER,u,c,t.width,t.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+n,e.RENDERBUFFER,s.__webglColorRenderbuffer[n])}e.bindRenderbuffer(e.RENDERBUFFER,null),t.depthBuffer&&(s.__webglDepthRenderbuffer=e.createRenderbuffer(),ce(s.__webglDepthRenderbuffer,t,!0)),n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(u){n.bindTexture(e.TEXTURE_CUBE_MAP,c.__webglTexture),re(e.TEXTURE_CUBE_MAP,i);for(let n=0;n<6;n++)if(i.mipmaps&&i.mipmaps.length>0)for(let r=0;r<i.mipmaps.length;r++)B(s.__webglFramebuffer[n][r],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,r);else B(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0);_(i)&&v(e.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(d){for(let i=0,a=l.length;i<a;i++){let a=l[i],o=r.get(a),c=e.TEXTURE_2D;(t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(c=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(c,o.__webglTexture),re(c,a),B(s.__webglFramebuffer,t,a,e.COLOR_ATTACHMENT0+i,c,0),_(a)&&v(c)}n.unbindTexture()}else{let r=e.TEXTURE_2D;if((t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(r=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(r,c.__webglTexture),re(r,i),i.mipmaps&&i.mipmaps.length>0)for(let n=0;n<i.mipmaps.length;n++)B(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,r,n);else B(s.__webglFramebuffer,t,i,e.COLOR_ATTACHMENT0,r,0);_(i)&&v(r),n.unbindTexture()}t.depthBuffer&&ue(t)}function me(e){let t=e.textures;for(let i=0,a=t.length;i<a;i++){let a=t[i];if(_(a)){let t=y(e),i=r.get(a).__webglTexture;n.bindTexture(t,i),v(t),n.unbindTexture()}}}let he=[],U=[];function G(t){if(t.samples>0){if(q(t)===!1){let i=t.textures,a=t.width,o=t.height,s=e.COLOR_BUFFER_BIT,l=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,u=r.get(t),d=i.length>1;if(d)for(let t=0;t<i.length;t++)n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,u.__webglMultisampledFramebuffer);let f=t.texture.mipmaps;f&&f.length>0?n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer[0]):n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer);for(let n=0;n<i.length;n++){if(t.resolveDepthBuffer&&(t.depthBuffer&&(s|=e.DEPTH_BUFFER_BIT),t.stencilBuffer&&t.resolveStencilBuffer&&(s|=e.STENCIL_BUFFER_BIT)),d){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,u.__webglColorRenderbuffer[n]);let t=r.get(i[n]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0)}e.blitFramebuffer(0,0,a,o,0,0,a,o,s,e.NEAREST),c===!0&&(he.length=0,U.length=0,he.push(e.COLOR_ATTACHMENT0+n),t.depthBuffer&&t.resolveDepthBuffer===!1&&(he.push(l),U.push(l),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,U)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,he))}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),d)for(let t=0;t<i.length;t++){n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,u.__webglColorRenderbuffer[t]);let a=r.get(i[t]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,a,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglMultisampledFramebuffer)}else if(t.depthBuffer&&t.resolveDepthBuffer===!1&&c){let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[n])}}}function K(e){return Math.min(i.maxSamples,e.samples)}function q(e){let n=r.get(e);return e.samples>0&&t.has(`WEBGL_multisampled_render_to_texture`)===!0&&n.__useRenderToTexture!==!1}function J(e){let t=o.render.frame;u.get(e)!==t&&(u.set(e,t),e.update())}function Y(e,t){let n=e.colorSpace,r=e.format,i=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||n!==`srgb-linear`&&n!==``&&(V.getTransfer(n)===`srgb`?(r!==1023||i!==1009)&&console.warn(`THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):console.error(`THREE.WebGLTextures: Unsupported texture color space:`,n)),t}function _e(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement?(l.width=e.naturalWidth||e.width,l.height=e.naturalHeight||e.height):typeof VideoFrame<`u`&&e instanceof VideoFrame?(l.width=e.displayWidth,l.height=e.displayHeight):(l.width=e.width,l.height=e.height),l}this.allocateTextureUnit=j,this.resetTextureUnits=A,this.setTexture2D=ee,this.setTexture2DArray=N,this.setTexture3D=P,this.setTextureCube=te,this.rebindTextures=de,this.setupRenderTarget=fe,this.updateRenderTargetMipmap=me,this.updateMultisampleRenderTarget=G,this.setupDepthRenderbuffer=ue,this.setupFrameBufferTexture=B,this.useMultisampledRTT=q}function Wr(e,t){function n(n,r=``){let i,a=V.getTransfer(r);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return e.HALF_FLOAT;if(n===1021)return e.ALPHA;if(n===1022)return e.RGB;if(n===1023)return e.RGBA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779){if(a===`srgb`){if(i=t.get(`WEBGL_compressed_texture_s3tc_srgb`),i!==null){if(n===33776)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null}else if(i=t.get(`WEBGL_compressed_texture_s3tc`),i!==null){if(n===33776)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null}if(n===35840||n===35841||n===35842||n===35843){if(i=t.get(`WEBGL_compressed_texture_pvrtc`),i!==null){if(n===35840)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null}if(n===36196||n===37492||n===37496){if(i=t.get(`WEBGL_compressed_texture_etc`),i!==null){if(n===36196||n===37492)return a===`srgb`?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(n===37496)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC}else return null}if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821){if(i=t.get(`WEBGL_compressed_texture_astc`),i!==null){if(n===37808)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null}if(n===36492||n===36494||n===36495){if(i=t.get(`EXT_texture_compression_bptc`),i!==null){if(n===36492)return a===`srgb`?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null}if(n===36283||n===36284||n===36285||n===36286){if(i=t.get(`EXT_texture_compression_rgtc`),i!==null){if(n===36283)return i.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null}return n===1020?e.UNSIGNED_INT_24_8:e[n]===void 0?null:e[n]}return{convert:n}}var Gr=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Kr=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,qr=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new J(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new He({vertexShader:Gr,fragmentShader:Kr,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new X(new M(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Jr=class extends n{constructor(e,t){super();let n=this,r=null,i=1,a=null,s=`local-floor`,c=1,u=null,d=null,f=null,p=null,h=null,g=null,_=typeof XRWebGLBinding<`u`,v=new qr,y={},x=t.getContextAttributes(),C=null,w=null,T=[],E=[],D=new m,O=null,k=new ce;k.viewport=new De;let j=new ce;j.viewport=new De;let M=[k,j],N=new xe,P=null,te=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=T[e];return t===void 0&&(t=new A,T[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=T[e];return t===void 0&&(t=new A,T[e]=t),t.getGripSpace()},this.getHand=function(e){let t=T[e];return t===void 0&&(t=new A,T[e]=t),t.getHandSpace()};function I(e){let t=E.indexOf(e.inputSource);if(t===-1)return;let n=T[t];n!==void 0&&(n.update(e.inputSource,e.frame,u||a),n.dispatchEvent({type:e.type,data:e.inputSource}))}function L(){r.removeEventListener(`select`,I),r.removeEventListener(`selectstart`,I),r.removeEventListener(`selectend`,I),r.removeEventListener(`squeeze`,I),r.removeEventListener(`squeezestart`,I),r.removeEventListener(`squeezeend`,I),r.removeEventListener(`end`,L),r.removeEventListener(`inputsourceschange`,ne);for(let e=0;e<T.length;e++){let t=E[e];t!==null&&(E[e]=null,T[e].disconnect(t))}P=null,te=null,v.reset();for(let e in y)delete y[e];e.setRenderTarget(C),h=null,p=null,f=null,r=null,w=null,le.stop(),n.isPresenting=!1,e.setPixelRatio(O),e.setSize(D.width,D.height,!1),n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){i=e,n.isPresenting===!0&&console.warn(`THREE.WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){s=e,n.isPresenting===!0&&console.warn(`THREE.WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return u||a},this.setReferenceSpace=function(e){u=e},this.getBaseLayer=function(){return p===null?h:p},this.getBinding=function(){return f===null&&_&&(f=new XRWebGLBinding(r,t)),f},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function(l){if(r=l,r!==null){if(C=e.getRenderTarget(),r.addEventListener(`select`,I),r.addEventListener(`selectstart`,I),r.addEventListener(`selectend`,I),r.addEventListener(`squeeze`,I),r.addEventListener(`squeezestart`,I),r.addEventListener(`squeezeend`,I),r.addEventListener(`end`,L),r.addEventListener(`inputsourceschange`,ne),x.xrCompatible!==!0&&await t.makeXRCompatible(),O=e.getPixelRatio(),e.getSize(D),_&&`createProjectionLayer`in XRWebGLBinding.prototype){let n=null,a=null,s=null;x.depth&&(s=x.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,n=x.stencil?Re:o,a=x.stencil?qe:F);let c={colorFormat:t.RGBA8,depthFormat:s,scaleFactor:i};f=this.getBinding(),p=f.createProjectionLayer(c),r.updateRenderState({layers:[p]}),e.setPixelRatio(1),e.setSize(p.textureWidth,p.textureHeight,!1),w=new R(p.textureWidth,p.textureHeight,{format:Y,type:S,depthTexture:new ee(p.textureWidth,p.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,n),stencilBuffer:x.stencil,colorSpace:e.outputColorSpace,samples:x.antialias?4:0,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}else{let n={antialias:x.antialias,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:i};h=new XRWebGLLayer(r,t,n),r.updateRenderState({baseLayer:h}),e.setPixelRatio(1),e.setSize(h.framebufferWidth,h.framebufferHeight,!1),w=new R(h.framebufferWidth,h.framebufferHeight,{format:Y,type:S,colorSpace:e.outputColorSpace,stencilBuffer:x.stencil,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1})}w.isXRRenderTarget=!0,this.setFoveation(c),u=null,a=await r.requestReferenceSpace(s),le.setContext(r),le.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};function ne(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=E.indexOf(n);r>=0&&(E[r]=null,T[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=E.indexOf(n);if(r===-1){for(let e=0;e<T.length;e++)if(e>=E.length){E.push(n),r=e;break}else if(E[e]===null){E[e]=n,r=e;break}if(r===-1)break}let i=T[r];i&&i.connect(n)}}let re=new b,ie=new b;function ae(e,t,n){re.setFromMatrixPosition(t.matrixWorld),ie.setFromMatrixPosition(n.matrixWorld);let r=re.distanceTo(ie),i=t.projectionMatrix.elements,a=n.projectionMatrix.elements,o=i[14]/(i[10]-1),s=i[14]/(i[10]+1),c=(i[9]+1)/i[5],l=(i[9]-1)/i[5],u=(i[8]-1)/i[0],d=(a[8]+1)/a[0],f=o*u,p=o*d,m=r/(-u+d),h=m*-u;if(t.matrixWorld.decompose(e.position,e.quaternion,e.scale),e.translateX(h),e.translateZ(m),e.matrixWorld.compose(e.position,e.quaternion,e.scale),e.matrixWorldInverse.copy(e.matrixWorld).invert(),i[10]===-1)e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse);else{let t=o+m,n=s+m,i=f-h,a=p+(r-h),u=c*s/n*t,d=l*s/n*t;e.projectionMatrix.makePerspective(i,a,u,d,t,n),e.projectionMatrixInverse.copy(e.projectionMatrix).invert()}}function z(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(r===null)return;let t=e.near,n=e.far;v.texture!==null&&(v.depthNear>0&&(t=v.depthNear),v.depthFar>0&&(n=v.depthFar)),N.near=j.near=k.near=t,N.far=j.far=k.far=n,(P!==N.near||te!==N.far)&&(r.updateRenderState({depthNear:N.near,depthFar:N.far}),P=N.near,te=N.far),N.layers.mask=e.layers.mask|6,k.layers.mask=N.layers.mask&3,j.layers.mask=N.layers.mask&5;let i=e.parent,a=N.cameras;z(N,i);for(let e=0;e<a.length;e++)z(a[e],i);a.length===2?ae(N,k,j):N.projectionMatrix.copy(k.projectionMatrix),oe(e,N,i)};function oe(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=l*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return N},this.getFoveation=function(){if(p!==null||h!==null)return c},this.setFoveation=function(e){c=e,p!==null&&(p.fixedFoveation=e),h!==null&&h.fixedFoveation!==void 0&&(h.fixedFoveation=e)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(N)},this.getCameraTexture=function(e){return y[e]};let se=null;function B(t,i){if(d=i.getViewerPose(u||a),g=i,d!==null){let t=d.views;h!==null&&(e.setRenderTargetFramebuffer(w,h.framebuffer),e.setRenderTarget(w));let i=!1;t.length!==N.cameras.length&&(N.cameras.length=0,i=!0);for(let n=0;n<t.length;n++){let r=t[n],a=null;if(h!==null)a=h.getViewport(r);else{let t=f.getViewSubImage(p,r);a=t.viewport,n===0&&(e.setRenderTargetTextures(w,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(w))}let o=M[n];o===void 0&&(o=new ce,o.layers.enable(n),o.viewport=new De,M[n]=o),o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.projectionMatrix.fromArray(r.projectionMatrix),o.projectionMatrixInverse.copy(o.projectionMatrix).invert(),o.viewport.set(a.x,a.y,a.width,a.height),n===0&&(N.matrix.copy(o.matrix),N.matrix.decompose(N.position,N.quaternion,N.scale)),i===!0&&N.cameras.push(o)}let a=r.enabledFeatures;if(a&&a.includes(`depth-sensing`)&&r.depthUsage==`gpu-optimized`&&_){f=n.getBinding();let e=f.getDepthInformation(t[0]);e&&e.isValid&&e.texture&&v.init(e,r.renderState)}if(a&&a.includes(`camera-access`)&&_){e.state.unbindTexture(),f=n.getBinding();for(let e=0;e<t.length;e++){let n=t[e].camera;if(n){let e=y[n];e||(e=new J,y[n]=e);let t=f.getCameraImage(n);e.sourceTexture=t}}}}for(let e=0;e<T.length;e++){let t=E[e],n=T[e];t!==null&&n!==void 0&&n.update(t,i,u||a)}se&&se(t,i),i.detectedPlanes&&n.dispatchEvent({type:`planesdetected`,data:i}),g=null}let le=new Ze;le.setAnimationLoop(B),this.setAnimationLoop=function(e){se=e},this.dispose=function(){}}},Yr=new _e,Xr=new oe;function Zr(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,K(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isMeshBasicMaterial||t.isMeshLambertMaterial?a(e,t):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(e,r){e.opacity.value=r.opacity,r.color&&e.diffuse.value.copy(r.color),r.emissive&&e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(e.map.value=r.map,n(r.map,e.mapTransform)),r.alphaMap&&(e.alphaMap.value=r.alphaMap,n(r.alphaMap,e.alphaMapTransform)),r.bumpMap&&(e.bumpMap.value=r.bumpMap,n(r.bumpMap,e.bumpMapTransform),e.bumpScale.value=r.bumpScale,r.side===1&&(e.bumpScale.value*=-1)),r.normalMap&&(e.normalMap.value=r.normalMap,n(r.normalMap,e.normalMapTransform),e.normalScale.value.copy(r.normalScale),r.side===1&&e.normalScale.value.negate()),r.displacementMap&&(e.displacementMap.value=r.displacementMap,n(r.displacementMap,e.displacementMapTransform),e.displacementScale.value=r.displacementScale,e.displacementBias.value=r.displacementBias),r.emissiveMap&&(e.emissiveMap.value=r.emissiveMap,n(r.emissiveMap,e.emissiveMapTransform)),r.specularMap&&(e.specularMap.value=r.specularMap,n(r.specularMap,e.specularMapTransform)),r.alphaTest>0&&(e.alphaTest.value=r.alphaTest);let i=t.get(r),a=i.envMap,o=i.envMapRotation;a&&(e.envMap.value=a,Yr.copy(o),Yr.x*=-1,Yr.y*=-1,Yr.z*=-1,a.isCubeTexture&&a.isRenderTargetTexture===!1&&(Yr.y*=-1,Yr.z*=-1),e.envMapRotation.value.setFromMatrix4(Xr.makeRotationFromEuler(Yr)),e.flipEnvMap.value=a.isCubeTexture&&a.isRenderTargetTexture===!1?-1:1,e.reflectivity.value=r.reflectivity,e.ior.value=r.ior,e.refractionRatio.value=r.refractionRatio),r.lightMap&&(e.lightMap.value=r.lightMap,e.lightMapIntensity.value=r.lightMapIntensity,n(r.lightMap,e.lightMapTransform)),r.aoMap&&(e.aoMap.value=r.aoMap,e.aoMapIntensity.value=r.aoMapIntensity,n(r.aoMap,e.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessRange[0],e.iridescenceThicknessMaximum.value=t.iridescenceThicknessRange[1],t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function Qr(e,t,n,r){let i={},a={},o=[],s=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function c(e,t){let n=t.program;r.uniformBlockBinding(e,n)}function l(e,n){let o=i[e.id];o===void 0&&(m(e),o=u(e),i[e.id]=o,e.addEventListener(`dispose`,g));let s=n.program;r.updateUBOMapping(e,s);let c=t.render.frame;a[e.id]!==c&&(f(e),a[e.id]=c)}function u(t){let n=d();t.__bindingPointIndex=n;let r=e.createBuffer(),i=t.__size,a=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,r),e.bufferData(e.UNIFORM_BUFFER,i,a),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,n,r),r}function d(){for(let e=0;e<s;e++)if(o.indexOf(e)===-1)return o.push(e),e;return console.error(`THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached.`),0}function f(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let t=0,n=r.length;t<n;t++){let n=Array.isArray(r[t])?r[t]:[r[t]];for(let r=0,i=n.length;r<i;r++){let i=n[r];if(p(i,t,r,a)===!0){let t=i.__offset,n=Array.isArray(i.value)?i.value:[i.value],r=0;for(let a=0;a<n.length;a++){let o=n[a],s=h(o);typeof o==`number`||typeof o==`boolean`?(i.__data[0]=o,e.bufferSubData(e.UNIFORM_BUFFER,t+r,i.__data)):o.isMatrix3?(i.__data[0]=o.elements[0],i.__data[1]=o.elements[1],i.__data[2]=o.elements[2],i.__data[3]=0,i.__data[4]=o.elements[3],i.__data[5]=o.elements[4],i.__data[6]=o.elements[5],i.__data[7]=0,i.__data[8]=o.elements[6],i.__data[9]=o.elements[7],i.__data[10]=o.elements[8],i.__data[11]=0):(o.toArray(i.__data,r),r+=s.storage/Float32Array.BYTES_PER_ELEMENT)}e.bufferSubData(e.UNIFORM_BUFFER,t,i.__data)}}}e.bindBuffer(e.UNIFORM_BUFFER,null)}function p(e,t,n,r){let i=e.value,a=t+`_`+n;if(r[a]===void 0)return r[a]=typeof i==`number`||typeof i==`boolean`?i:i.clone(),!0;{let e=r[a];if(typeof i==`number`||typeof i==`boolean`){if(e!==i)return r[a]=i,!0}else if(e.equals(i)===!1)return e.copy(i),!0}return!1}function m(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let e=0,t=r.length;e<t;e++){let t=r[e],i=Array.isArray(t.value)?t.value:[t.value];for(let e=0,r=i.length;e<r;e++){let r=i[e],a=h(r),o=n%16,s=o%a.boundary,c=o+s;n+=s,c!==0&&16-c<a.storage&&(n+=16-c),t.__data=new Float32Array(a.storage/Float32Array.BYTES_PER_ELEMENT),t.__offset=n,n+=a.storage}}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function h(e){let t={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(t.boundary=4,t.storage=4):e.isVector2?(t.boundary=8,t.storage=8):e.isVector3||e.isColor?(t.boundary=16,t.storage=12):e.isVector4?(t.boundary=16,t.storage=16):e.isMatrix3?(t.boundary=48,t.storage=48):e.isMatrix4?(t.boundary=64,t.storage=64):e.isTexture?console.warn(`THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group.`):console.warn(`THREE.WebGLRenderer: Unsupported uniform value type.`,e),t}function g(t){let n=t.target;n.removeEventListener(`dispose`,g);let r=o.indexOf(n.__bindingPointIndex);o.splice(r,1),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function _(){for(let t in i)e.deleteBuffer(i[t]);o=[],i={},a={}}return{bind:c,update:l,dispose:_}}var $r=class{constructor(t={}){let{canvas:n=Me(),context:r=null,depth:i=!0,stencil:o=!1,alpha:s=!1,antialias:c=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:u=!1,powerPreference:d=`default`,failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:p=!1}=t;this.isWebGLRenderer=!0;let m;if(r!==null){if(typeof WebGLRenderingContext<`u`&&r instanceof WebGLRenderingContext)throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);m=r.getContextAttributes().alpha}else m=s;let h=new Uint32Array(4),g=new Int32Array(4),_=null,v=null,y=[],C=[];this.domElement=n,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let w=this,T=!1;this._outputColorSpace=Ie;let E=0,D=0,O=null,k=-1,A=null,j=new De,M=new De,ee=null,N=new U(0),P=0,te=n.width,F=n.height,I=1,L=null,ne=null,ae=new De(0,0,te,F),z=new De(0,0,te,F),se=!1,B=new x,ce=!1,le=!1,ue=new oe,de=new b,fe=new De,pe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},me=!1;function he(){return O===null?I:1}let H=r;function ge(e,t){return n.getContext(e,t)}try{let e={alpha:!0,depth:i,stencil:o,antialias:c,premultipliedAlpha:l,preserveDrawingBuffer:u,powerPreference:d,failIfMajorPerformanceCaveat:f};if(`setAttribute`in n&&n.setAttribute(`data-engine`,`three.js r180`),n.addEventListener(`webglcontextlost`,Be,!1),n.addEventListener(`webglcontextrestored`,Ve,!1),n.addEventListener(`webglcontextcreationerror`,He,!1),H===null){let t=`webgl2`;if(H=ge(t,e),H===null)throw ge(t)?Error(`Error creating WebGL context with your selected attributes.`):Error(`Error creating WebGL context.`)}}catch(e){throw console.error(`THREE.WebGLRenderer: `+e.message),e}let W,G,K,q,J,Y,_e,ve,ye,be,xe,Se,Ce,X,Te,Ee,Oe,ke,Ae,je,Ne,Pe,Fe,Le;function Re(){W=new jt(H),W.init(),Pe=new Wr(H,W),G=new ot(H,W,t,Pe),K=new Hr(H,W),G.reversedDepthBuffer&&p&&K.buffers.depth.setReversed(!0),q=new Pt(H),J=new Er,Y=new Ur(H,W,K,J,G,Pe,q),_e=new ct(w),ve=new At(w),ye=new Qe(H),Fe=new it(H,ye),be=new Mt(H,ye,q,Fe),xe=new It(H,be,ye,q),Ae=new Ft(H,G,Y),Ee=new st(J),Se=new Tr(w,_e,ve,W,G,Fe,Ee),Ce=new Zr(w,J),X=new Ar,Te=new Lr(W),ke=new rt(w,_e,ve,K,xe,m,l),Oe=new Br(w,xe,G),Le=new Qr(H,q,G,K),je=new at(H,W,q),Ne=new Nt(H,W,q),q.programs=Se.programs,w.capabilities=G,w.extensions=W,w.properties=J,w.renderLists=X,w.shadowMap=Oe,w.state=K,w.info=q}Re();let ze=new Jr(w,H);this.xr=ze,this.getContext=function(){return H},this.getContextAttributes=function(){return H.getContextAttributes()},this.forceContextLoss=function(){let e=W.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=W.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return I},this.setPixelRatio=function(e){e!==void 0&&(I=e,this.setSize(te,F,!1))},this.getSize=function(e){return e.set(te,F)},this.setSize=function(e,t,r=!0){ze.isPresenting?console.warn(`THREE.WebGLRenderer: Can't change size while VR device is presenting.`):(te=e,F=t,n.width=Math.floor(e*I),n.height=Math.floor(t*I),r===!0&&(n.style.width=e+`px`,n.style.height=t+`px`),this.setViewport(0,0,e,t))},this.getDrawingBufferSize=function(e){return e.set(te*I,F*I).floor()},this.setDrawingBufferSize=function(e,t,r){te=e,F=t,I=r,n.width=Math.floor(e*r),n.height=Math.floor(t*r),this.setViewport(0,0,e,t)},this.getCurrentViewport=function(e){return e.copy(j)},this.getViewport=function(e){return e.copy(ae)},this.setViewport=function(e,t,n,r){e.isVector4?ae.set(e.x,e.y,e.z,e.w):ae.set(e,t,n,r),K.viewport(j.copy(ae).multiplyScalar(I).round())},this.getScissor=function(e){return e.copy(z)},this.setScissor=function(e,t,n,r){e.isVector4?z.set(e.x,e.y,e.z,e.w):z.set(e,t,n,r),K.scissor(M.copy(z).multiplyScalar(I).round())},this.getScissorTest=function(){return se},this.setScissorTest=function(e){K.setScissorTest(se=e)},this.setOpaqueSort=function(e){L=e},this.setTransparentSort=function(e){ne=e},this.getClearColor=function(e){return e.copy(ke.getClearColor())},this.setClearColor=function(){ke.setClearColor(...arguments)},this.getClearAlpha=function(){return ke.getClearAlpha()},this.setClearAlpha=function(){ke.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(O!==null){let t=O.texture.format;e=t===1033||t===1031||t===1029}if(e){let e=O.texture.type,t=e===1009||e===1014||e===1012||e===1020||e===1017||e===1018,n=ke.getClearColor(),r=ke.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(h[0]=i,h[1]=a,h[2]=o,h[3]=r,H.clearBufferuiv(H.COLOR,0,h)):(g[0]=i,g[1]=a,g[2]=o,g[3]=r,H.clearBufferiv(H.COLOR,0,g))}else r|=H.COLOR_BUFFER_BIT}t&&(r|=H.DEPTH_BUFFER_BIT),n&&(r|=H.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),H.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){n.removeEventListener(`webglcontextlost`,Be,!1),n.removeEventListener(`webglcontextrestored`,Ve,!1),n.removeEventListener(`webglcontextcreationerror`,He,!1),ke.dispose(),X.dispose(),Te.dispose(),J.dispose(),_e.dispose(),ve.dispose(),xe.dispose(),Fe.dispose(),Le.dispose(),Se.dispose(),ze.dispose(),ze.removeEventListener(`sessionstart`,Ye),ze.removeEventListener(`sessionend`,Xe),Q.stop()};function Be(e){e.preventDefault(),console.log(`THREE.WebGLRenderer: Context Lost.`),T=!0}function Ve(){console.log(`THREE.WebGLRenderer: Context Restored.`),T=!1;let e=q.autoReset,t=Oe.enabled,n=Oe.autoUpdate,r=Oe.needsUpdate,i=Oe.type;Re(),q.autoReset=e,Oe.enabled=t,Oe.autoUpdate=n,Oe.needsUpdate=r,Oe.type=i}function He(e){console.error(`THREE.WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function Ue(e){let t=e.target;t.removeEventListener(`dispose`,Ue),We(t)}function We(e){Ge(e),J.remove(e)}function Ge(e){let t=J.get(e).programs;t!==void 0&&(t.forEach(function(e){Se.releaseProgram(e)}),e.isShaderMaterial&&Se.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=pe);let o=i.isMesh&&i.matrixWorld.determinant()<0,s=ft(e,t,n,r,i);K.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=be.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;Fe.setup(i,r,s,n,c);let h,g=je;if(c!==null&&(h=ye.get(c),g=Ne,g.setIndex(h)),i.isMesh)r.wireframe===!0?(K.setLineWidth(r.wireframeLinewidth*he()),g.setMode(H.LINES)):g.setMode(H.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),K.setLineWidth(e*he()),i.isLineSegments?g.setMode(H.LINES):i.isLineLoop?g.setMode(H.LINE_LOOP):g.setMode(H.LINE_STRIP)}else i.isPoints?g.setMode(H.POINTS):i.isSprite&&g.setMode(H.TRIANGLES);if(i.isBatchedMesh){if(i._multiDrawInstances!==null)Z(`THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection.`),g.renderMultiDrawInstances(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount,i._multiDrawInstances);else if(W.get(`WEBGL_multi_draw`))g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else{let e=i._multiDrawStarts,t=i._multiDrawCounts,n=i._multiDrawCount,a=c?ye.get(c).bytesPerElement:1,o=J.get(r).currentProgram.getUniforms();for(let r=0;r<n;r++)o.setValue(H,`_gl_DrawID`,r),g.render(e[r]/a,t[r])}}else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function Ke(e,t,n){e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,lt(e,t,n),e.side=0,e.needsUpdate=!0,lt(e,t,n),e.side=2):lt(e,t,n)}this.compile=function(e,t,n=null){n===null&&(n=e),v=Te.get(n),v.init(t),C.push(v),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(v.pushLight(e),e.castShadow&&v.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(v.pushLight(e),e.castShadow&&v.pushShadow(e))}),v.setupLights();let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let t=e.material;if(t){if(Array.isArray(t))for(let i=0;i<t.length;i++){let a=t[i];Ke(a,n,e),r.add(a)}else Ke(t,n,e),r.add(t)}}),v=C.pop(),r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){r.forEach(function(e){J.get(e).currentProgram.isReady()&&r.delete(e)}),r.size===0?t(e):setTimeout(n,10)}W.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let qe=null;function Je(e){qe&&qe(e)}function Ye(){Q.stop()}function Xe(){Q.start()}let Q=new Ze;Q.setAnimationLoop(Je),typeof self<`u`&&Q.setContext(self),this.setAnimationLoop=function(e){qe=e,ze.setAnimationLoop(e),e===null?Q.stop():Q.start()},ze.addEventListener(`sessionstart`,Ye),ze.addEventListener(`sessionend`,Xe),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){console.error(`THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(T===!0)return;if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),ze.enabled===!0&&ze.isPresenting===!0&&(ze.cameraAutoUpdate===!0&&ze.updateCamera(t),t=ze.getCamera()),e.isScene===!0&&e.onBeforeRender(w,e,t,O),v=Te.get(e,C.length),v.init(t),C.push(v),ue.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),B.setFromProjectionMatrix(ue,re,t.reversedDepth),le=this.localClippingEnabled,ce=Ee.init(this.clippingPlanes,le),_=X.get(e,y.length),_.init(),y.push(_),ze.enabled===!0&&ze.isPresenting===!0){let e=w.xr.getDepthSensingMesh();e!==null&&$(e,t,-1/0,w.sortObjects)}$(e,t,0,w.sortObjects),_.finish(),w.sortObjects===!0&&_.sort(L,ne),me=ze.enabled===!1||ze.isPresenting===!1||ze.hasDepthSensing()===!1,me&&ke.addToRenderList(_,e),this.info.render.frame++,ce===!0&&Ee.beginShadows();let n=v.state.shadowsArray;Oe.render(n,e,t),ce===!0&&Ee.endShadows(),this.info.autoReset===!0&&this.info.reset();let r=_.opaque,i=_.transmissive;if(v.setupLights(),t.isArrayCamera){let n=t.cameras;if(i.length>0)for(let t=0,a=n.length;t<a;t++){let a=n[t];et(r,i,e,a)}me&&ke.render(e);for(let t=0,r=n.length;t<r;t++){let r=n[t];$e(_,e,r,r.viewport)}}else i.length>0&&et(r,i,e,t),me&&ke.render(e),$e(_,e,t);O!==null&&D===0&&(Y.updateMultisampleRenderTarget(O),Y.updateRenderTargetMipmap(O)),e.isScene===!0&&e.onAfterRender(w,e,t),Fe.resetDefaultState(),k=-1,A=null,C.pop(),C.length>0?(v=C[C.length-1],ce===!0&&Ee.setGlobalState(w.clippingPlanes,v.state.camera)):v=null,y.pop(),_=y.length>0?y[y.length-1]:null};function $(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLight)v.pushLight(e),e.castShadow&&v.pushShadow(e);else if(e.isSprite){if(!e.frustumCulled||B.intersectsSprite(e)){r&&fe.setFromMatrixPosition(e.matrixWorld).applyMatrix4(ue);let t=xe.update(e),i=e.material;i.visible&&_.push(e,t,i,n,fe.z,null)}}else if((e.isMesh||e.isLine||e.isPoints)&&(!e.frustumCulled||B.intersectsObject(e))){let t=xe.update(e),i=e.material;if(r&&(e.boundingSphere===void 0?(t.boundingSphere===null&&t.computeBoundingSphere(),fe.copy(t.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),fe.copy(e.boundingSphere.center)),fe.applyMatrix4(e.matrixWorld).applyMatrix4(ue)),Array.isArray(i)){let r=t.groups;for(let a=0,o=r.length;a<o;a++){let o=r[a],s=i[o.materialIndex];s&&s.visible&&_.push(e,t,s,n,fe.z,o)}}else i.visible&&_.push(e,t,i,n,fe.z,null)}}let i=e.children;for(let e=0,a=i.length;e<a;e++)$(i[e],t,n,r)}function $e(e,t,n,r){let i=e.opaque,a=e.transmissive,o=e.transparent;v.setupLightsView(n),ce===!0&&Ee.setGlobalState(w.clippingPlanes,n),r&&K.viewport(j.copy(r)),i.length>0&&tt(i,t,n),a.length>0&&tt(a,t,n),o.length>0&&tt(o,t,n),K.buffers.depth.setTest(!0),K.buffers.depth.setMask(!0),K.buffers.color.setMask(!0),K.setPolygonOffset(!1)}function et(e,t,n,r){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;v.state.transmissionRenderTarget[r.id]===void 0&&(v.state.transmissionRenderTarget[r.id]=new R(1,1,{generateMipmaps:!0,type:W.has(`EXT_color_buffer_half_float`)||W.has(`EXT_color_buffer_float`)?a:S,minFilter:ie,samples:4,stencilBuffer:o,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:V.workingColorSpace}));let i=v.state.transmissionRenderTarget[r.id],s=r.viewport||j;i.setSize(s.z*w.transmissionResolutionScale,s.w*w.transmissionResolutionScale);let c=w.getRenderTarget(),l=w.getActiveCubeFace(),u=w.getActiveMipmapLevel();w.setRenderTarget(i),w.getClearColor(N),P=w.getClearAlpha(),P<1&&w.setClearColor(16777215,.5),w.clear(),me&&ke.render(n);let d=w.toneMapping;w.toneMapping=0;let f=r.viewport;if(r.viewport!==void 0&&(r.viewport=void 0),v.setupLightsView(r),ce===!0&&Ee.setGlobalState(w.clippingPlanes,r),tt(e,n,r),Y.updateMultisampleRenderTarget(i),Y.updateRenderTargetMipmap(i),W.has(`WEBGL_multisampled_render_to_texture`)===!1){let e=!1;for(let i=0,a=t.length;i<a;i++){let a=t[i],o=a.object,s=a.geometry,c=a.material,l=a.group;if(c.side===2&&o.layers.test(r.layers)){let t=c.side;c.side=1,c.needsUpdate=!0,nt(o,n,r,s,c,l),c.side=t,c.needsUpdate=!0,e=!0}}e===!0&&(Y.updateMultisampleRenderTarget(i),Y.updateRenderTargetMipmap(i))}w.setRenderTarget(c,l,u),w.setClearColor(N,P),f!==void 0&&(r.viewport=f),w.toneMapping=d}function tt(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],o=a.object,s=a.geometry,c=a.group,l=a.material;l.allowOverride===!0&&r!==null&&(l=r),o.layers.test(n.layers)&&nt(o,t,n,s,l,c)}}function nt(e,t,n,r,i,a){e.onBeforeRender(w,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(w,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,w.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,w.renderBufferDirect(n,t,r,i,e,a),i.side=2):w.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(w,t,n,r,i,a)}function lt(e,t,n){t.isScene!==!0&&(t=pe);let r=J.get(e),i=v.state.lights,a=v.state.shadowsArray,o=i.state.version,s=Se.getParameters(e,i.state,a,t,n),c=Se.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial?t.environment:null,r.fog=t.fog,r.envMap=(e.isMeshStandardMaterial?ve:_e).get(e.envMap||r.environment),r.envMapRotation=r.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,l===void 0&&(e.addEventListener(`dispose`,Ue),l=new Map,r.programs=l);let u=l.get(c);if(u!==void 0){if(r.currentProgram===u&&r.lightsStateVersion===o)return dt(e,s),u}else s.uniforms=Se.getUniforms(e),e.onBeforeCompile(s,w),u=Se.acquireProgram(s,c),l.set(c,u),r.uniforms=s.uniforms;let d=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(d.clippingPlanes=Ee.uniform),dt(e,s),r.needsLights=mt(e),r.lightsStateVersion=o,r.needsLights&&(d.ambientLightColor.value=i.state.ambient,d.lightProbe.value=i.state.probe,d.directionalLights.value=i.state.directional,d.directionalLightShadows.value=i.state.directionalShadow,d.spotLights.value=i.state.spot,d.spotLightShadows.value=i.state.spotShadow,d.rectAreaLights.value=i.state.rectArea,d.ltc_1.value=i.state.rectAreaLTC1,d.ltc_2.value=i.state.rectAreaLTC2,d.pointLights.value=i.state.point,d.pointLightShadows.value=i.state.pointShadow,d.hemisphereLights.value=i.state.hemi,d.directionalShadowMap.value=i.state.directionalShadowMap,d.directionalShadowMatrix.value=i.state.directionalShadowMatrix,d.spotShadowMap.value=i.state.spotShadowMap,d.spotLightMatrix.value=i.state.spotLightMatrix,d.spotLightMap.value=i.state.spotLightMap,d.pointShadowMap.value=i.state.pointShadowMap,d.pointShadowMatrix.value=i.state.pointShadowMatrix),r.currentProgram=u,r.uniformsList=null,u}function ut(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=Wn.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function dt(e,t){let n=J.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function ft(t,n,r,i,a){n.isScene!==!0&&(n=pe),Y.resetTextureUnits();let o=n.fog,s=i.isMeshStandardMaterial?n.environment:null,c=O===null?w.outputColorSpace:O.isXRRenderTarget===!0?O.texture.colorSpace:e,l=(i.isMeshStandardMaterial?ve:_e).get(i.envMap||s),u=i.vertexColors===!0&&!!r.attributes.color&&r.attributes.color.itemSize===4,d=!!r.attributes.tangent&&(!!i.normalMap||i.anisotropy>0),f=!!r.morphAttributes.position,p=!!r.morphAttributes.normal,m=!!r.morphAttributes.color,h=0;i.toneMapped&&(O===null||O.isXRRenderTarget===!0)&&(h=w.toneMapping);let g=r.morphAttributes.position||r.morphAttributes.normal||r.morphAttributes.color,_=g===void 0?0:g.length,y=J.get(i),b=v.state.lights;if(ce===!0&&(le===!0||t!==A)){let e=t===A&&i.id===k;Ee.setState(i,t,e)}let x=!1;i.version===y.__version?y.needsLights&&y.lightsStateVersion!==b.state.version?x=!0:y.outputColorSpace===c?a.isBatchedMesh&&y.batching===!1||!a.isBatchedMesh&&y.batching===!0||a.isBatchedMesh&&y.batchingColor===!0&&a.colorTexture===null||a.isBatchedMesh&&y.batchingColor===!1&&a.colorTexture!==null||a.isInstancedMesh&&y.instancing===!1||!a.isInstancedMesh&&y.instancing===!0||a.isSkinnedMesh&&y.skinning===!1||!a.isSkinnedMesh&&y.skinning===!0||a.isInstancedMesh&&y.instancingColor===!0&&a.instanceColor===null||a.isInstancedMesh&&y.instancingColor===!1&&a.instanceColor!==null||a.isInstancedMesh&&y.instancingMorph===!0&&a.morphTexture===null||a.isInstancedMesh&&y.instancingMorph===!1&&a.morphTexture!==null?x=!0:y.envMap===l?i.fog===!0&&y.fog!==o||y.numClippingPlanes!==void 0&&(y.numClippingPlanes!==Ee.numPlanes||y.numIntersection!==Ee.numIntersection)?x=!0:y.vertexAlphas===u&&y.vertexTangents===d&&y.morphTargets===f&&y.morphNormals===p&&y.morphColors===m&&y.toneMapping===h?y.morphTargetsCount!==_&&(x=!0):x=!0:x=!0:x=!0:(x=!0,y.__version=i.version);let S=y.currentProgram;x===!0&&(S=lt(i,n,a));let C=!1,T=!1,E=!1,D=S.getUniforms(),j=y.uniforms;if(K.useProgram(S.program)&&(C=!0,T=!0,E=!0),i.id!==k&&(k=i.id,T=!0),C||A!==t){K.buffers.depth.getReversed()&&t.reversedDepth!==!0&&(t._reversedDepth=!0,t.updateProjectionMatrix()),D.setValue(H,`projectionMatrix`,t.projectionMatrix),D.setValue(H,`viewMatrix`,t.matrixWorldInverse);let e=D.map.cameraPosition;e!==void 0&&e.setValue(H,de.setFromMatrixPosition(t.matrixWorld)),G.logarithmicDepthBuffer&&D.setValue(H,`logDepthBufFC`,2/(Math.log(t.far+1)/Math.LN2)),(i.isMeshPhongMaterial||i.isMeshToonMaterial||i.isMeshLambertMaterial||i.isMeshBasicMaterial||i.isMeshStandardMaterial||i.isShaderMaterial)&&D.setValue(H,`isOrthographic`,t.isOrthographicCamera===!0),A!==t&&(A=t,T=!0,E=!0)}if(a.isSkinnedMesh){D.setOptional(H,a,`bindMatrix`),D.setOptional(H,a,`bindMatrixInverse`);let e=a.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),D.setValue(H,`boneTexture`,e.boneTexture,Y))}a.isBatchedMesh&&(D.setOptional(H,a,`batchingTexture`),D.setValue(H,`batchingTexture`,a._matricesTexture,Y),D.setOptional(H,a,`batchingIdTexture`),D.setValue(H,`batchingIdTexture`,a._indirectTexture,Y),D.setOptional(H,a,`batchingColorTexture`),a._colorsTexture!==null&&D.setValue(H,`batchingColorTexture`,a._colorsTexture,Y));let M=r.morphAttributes;if((M.position!==void 0||M.normal!==void 0||M.color!==void 0)&&Ae.update(a,r,S),(T||y.receiveShadow!==a.receiveShadow)&&(y.receiveShadow=a.receiveShadow,D.setValue(H,`receiveShadow`,a.receiveShadow)),i.isMeshGouraudMaterial&&i.envMap!==null&&(j.envMap.value=l,j.flipEnvMap.value=l.isCubeTexture&&l.isRenderTargetTexture===!1?-1:1),i.isMeshStandardMaterial&&i.envMap===null&&n.environment!==null&&(j.envMapIntensity.value=n.environmentIntensity),T&&(D.setValue(H,`toneMappingExposure`,w.toneMappingExposure),y.needsLights&&pt(j,E),o&&i.fog===!0&&Ce.refreshFogUniforms(j,o),Ce.refreshMaterialUniforms(j,i,I,F,v.state.transmissionRenderTarget[t.id]),Wn.upload(H,ut(y),j,Y)),i.isShaderMaterial&&i.uniformsNeedUpdate===!0&&(Wn.upload(H,ut(y),j,Y),i.uniformsNeedUpdate=!1),i.isSpriteMaterial&&D.setValue(H,`center`,a.center),D.setValue(H,`modelViewMatrix`,a.modelViewMatrix),D.setValue(H,`normalMatrix`,a.normalMatrix),D.setValue(H,`modelMatrix`,a.matrixWorld),i.isShaderMaterial||i.isRawShaderMaterial){let e=i.uniformsGroups;for(let t=0,n=e.length;t<n;t++){let n=e[t];Le.update(n,S),Le.bind(n,S)}}return S}function pt(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function mt(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return E},this.getActiveMipmapLevel=function(){return D},this.getRenderTarget=function(){return O},this.setRenderTargetTextures=function(e,t,n){let r=J.get(e);r.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,r.__autoAllocateDepthBuffer===!1&&(r.__useRenderToTexture=!1),J.get(e.texture).__webglTexture=t,J.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:n,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let n=J.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0};let ht=H.createFramebuffer();this.setRenderTarget=function(e,t=0,n=0){O=e,E=t,D=n;let r=!0,i=null,a=!1,o=!1;if(e){let s=J.get(e);if(s.__useDefaultFramebuffer!==void 0)K.bindFramebuffer(H.FRAMEBUFFER,null),r=!1;else if(s.__webglFramebuffer===void 0)Y.setupRenderTarget(e);else if(s.__hasExternalTextures)Y.rebindTextures(e,J.get(e.texture).__webglTexture,J.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(s.__boundDepthTexture!==t){if(t!==null&&J.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error(`WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.`);Y.setupDepthRenderbuffer(e)}}let c=e.texture;(c.isData3DTexture||c.isDataArrayTexture||c.isCompressedArrayTexture)&&(o=!0);let l=J.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(i=Array.isArray(l[t])?l[t][n]:l[t],a=!0):i=e.samples>0&&Y.useMultisampledRTT(e)===!1?J.get(e).__webglMultisampledFramebuffer:Array.isArray(l)?l[n]:l,j.copy(e.viewport),M.copy(e.scissor),ee=e.scissorTest}else j.copy(ae).multiplyScalar(I).floor(),M.copy(z).multiplyScalar(I).floor(),ee=se;if(n!==0&&(i=ht),K.bindFramebuffer(H.FRAMEBUFFER,i)&&r&&K.drawBuffers(e,i),K.viewport(j),K.scissor(M),K.setScissorTest(ee),a){let r=J.get(e.texture);H.framebufferTexture2D(H.FRAMEBUFFER,H.COLOR_ATTACHMENT0,H.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(o){let r=t;for(let t=0;t<e.textures.length;t++){let i=J.get(e.textures[t]);H.framebufferTextureLayer(H.FRAMEBUFFER,H.COLOR_ATTACHMENT0+t,i.__webglTexture,n,r)}}else if(e!==null&&n!==0){let t=J.get(e.texture);H.framebufferTexture2D(H.FRAMEBUFFER,H.COLOR_ATTACHMENT0,H.TEXTURE_2D,t.__webglTexture,n)}k=-1},this.readRenderTargetPixels=function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget)){console.error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let c=J.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){K.bindFramebuffer(H.FRAMEBUFFER,c);try{let o=e.textures[s],c=o.format,l=o.type;if(!G.textureFormatReadable(c)){console.error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}if(!G.textureTypeReadable(l)){console.error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&(e.textures.length>1&&H.readBuffer(H.COLOR_ATTACHMENT0+s),H.readPixels(t,n,r,i,Pe.convert(c),Pe.convert(l),a))}finally{let e=O===null?null:J.get(O).__webglFramebuffer;K.bindFramebuffer(H.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget))throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);let c=J.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){if(t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i){K.bindFramebuffer(H.FRAMEBUFFER,c);let o=e.textures[s],l=o.format,u=o.type;if(!G.textureFormatReadable(l))throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);if(!G.textureTypeReadable(u))throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);let d=H.createBuffer();H.bindBuffer(H.PIXEL_PACK_BUFFER,d),H.bufferData(H.PIXEL_PACK_BUFFER,a.byteLength,H.STREAM_READ),e.textures.length>1&&H.readBuffer(H.COLOR_ATTACHMENT0+s),H.readPixels(t,n,r,i,Pe.convert(l),Pe.convert(u),0);let f=O===null?null:J.get(O).__webglFramebuffer;K.bindFramebuffer(H.FRAMEBUFFER,f);let p=H.fenceSync(H.SYNC_GPU_COMMANDS_COMPLETE,0);return H.flush(),await we(H,p,4),H.bindBuffer(H.PIXEL_PACK_BUFFER,d),H.getBufferSubData(H.PIXEL_PACK_BUFFER,0,a),H.deleteBuffer(d),H.deleteSync(p),a}throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`)}},this.copyFramebufferToTexture=function(e,t=null,n=0){let r=2**-n,i=Math.floor(e.image.width*r),a=Math.floor(e.image.height*r),o=t===null?0:t.x,s=t===null?0:t.y;Y.setTexture2D(e,0),H.copyTexSubImage2D(H.TEXTURE_2D,n,0,0,o,s,i,a),K.unbindTexture()};let gt=H.createFramebuffer(),_t=H.createFramebuffer();this.copyTextureToTexture=function(e,t,n=null,r=null,i=0,a=null){a===null&&(i===0?a=0:(Z(`WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels.`),a=i,i=0));let o,s,c,l,u,d,f,p,m,h=e.isCompressedTexture?e.mipmaps[a]:e.image;if(n!==null)o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.isBox3?n.max.z-n.min.z:1,l=n.min.x,u=n.min.y,d=n.isBox3?n.min.z:0;else{let t=2**-i;o=Math.floor(h.width*t),s=Math.floor(h.height*t),c=e.isDataArrayTexture?h.depth:e.isData3DTexture?Math.floor(h.depth*t):1,l=0,u=0,d=0}r===null?(f=0,p=0,m=0):(f=r.x,p=r.y,m=r.z);let g=Pe.convert(t.format),_=Pe.convert(t.type),v;t.isData3DTexture?(Y.setTexture3D(t,0),v=H.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(Y.setTexture2DArray(t,0),v=H.TEXTURE_2D_ARRAY):(Y.setTexture2D(t,0),v=H.TEXTURE_2D),H.pixelStorei(H.UNPACK_FLIP_Y_WEBGL,t.flipY),H.pixelStorei(H.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),H.pixelStorei(H.UNPACK_ALIGNMENT,t.unpackAlignment);let y=H.getParameter(H.UNPACK_ROW_LENGTH),b=H.getParameter(H.UNPACK_IMAGE_HEIGHT),x=H.getParameter(H.UNPACK_SKIP_PIXELS),S=H.getParameter(H.UNPACK_SKIP_ROWS),C=H.getParameter(H.UNPACK_SKIP_IMAGES);H.pixelStorei(H.UNPACK_ROW_LENGTH,h.width),H.pixelStorei(H.UNPACK_IMAGE_HEIGHT,h.height),H.pixelStorei(H.UNPACK_SKIP_PIXELS,l),H.pixelStorei(H.UNPACK_SKIP_ROWS,u),H.pixelStorei(H.UNPACK_SKIP_IMAGES,d);let w=e.isDataArrayTexture||e.isData3DTexture,T=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let n=J.get(e),r=J.get(t),h=J.get(n.__renderTarget),g=J.get(r.__renderTarget);K.bindFramebuffer(H.READ_FRAMEBUFFER,h.__webglFramebuffer),K.bindFramebuffer(H.DRAW_FRAMEBUFFER,g.__webglFramebuffer);for(let n=0;n<c;n++)w&&(H.framebufferTextureLayer(H.READ_FRAMEBUFFER,H.COLOR_ATTACHMENT0,J.get(e).__webglTexture,i,d+n),H.framebufferTextureLayer(H.DRAW_FRAMEBUFFER,H.COLOR_ATTACHMENT0,J.get(t).__webglTexture,a,m+n)),H.blitFramebuffer(l,u,o,s,f,p,o,s,H.DEPTH_BUFFER_BIT,H.NEAREST);K.bindFramebuffer(H.READ_FRAMEBUFFER,null),K.bindFramebuffer(H.DRAW_FRAMEBUFFER,null)}else if(i!==0||e.isRenderTargetTexture||J.has(e)){let n=J.get(e),r=J.get(t);K.bindFramebuffer(H.READ_FRAMEBUFFER,gt),K.bindFramebuffer(H.DRAW_FRAMEBUFFER,_t);for(let e=0;e<c;e++)w?H.framebufferTextureLayer(H.READ_FRAMEBUFFER,H.COLOR_ATTACHMENT0,n.__webglTexture,i,d+e):H.framebufferTexture2D(H.READ_FRAMEBUFFER,H.COLOR_ATTACHMENT0,H.TEXTURE_2D,n.__webglTexture,i),T?H.framebufferTextureLayer(H.DRAW_FRAMEBUFFER,H.COLOR_ATTACHMENT0,r.__webglTexture,a,m+e):H.framebufferTexture2D(H.DRAW_FRAMEBUFFER,H.COLOR_ATTACHMENT0,H.TEXTURE_2D,r.__webglTexture,a),i===0?T?H.copyTexSubImage3D(v,a,f,p,m+e,l,u,o,s):H.copyTexSubImage2D(v,a,f,p,l,u,o,s):H.blitFramebuffer(l,u,o,s,f,p,o,s,H.COLOR_BUFFER_BIT,H.NEAREST);K.bindFramebuffer(H.READ_FRAMEBUFFER,null),K.bindFramebuffer(H.DRAW_FRAMEBUFFER,null)}else T?e.isDataTexture||e.isData3DTexture?H.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h.data):t.isCompressedArrayTexture?H.compressedTexSubImage3D(v,a,f,p,m,o,s,c,g,h.data):H.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h):e.isDataTexture?H.texSubImage2D(H.TEXTURE_2D,a,f,p,o,s,g,_,h.data):e.isCompressedTexture?H.compressedTexSubImage2D(H.TEXTURE_2D,a,f,p,h.width,h.height,g,h.data):H.texSubImage2D(H.TEXTURE_2D,a,f,p,o,s,g,_,h);H.pixelStorei(H.UNPACK_ROW_LENGTH,y),H.pixelStorei(H.UNPACK_IMAGE_HEIGHT,b),H.pixelStorei(H.UNPACK_SKIP_PIXELS,x),H.pixelStorei(H.UNPACK_SKIP_ROWS,S),H.pixelStorei(H.UNPACK_SKIP_IMAGES,C),a===0&&t.generateMipmaps&&H.generateMipmap(v),K.unbindTexture()},this.initRenderTarget=function(e){J.get(e).__webglFramebuffer===void 0&&Y.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?Y.setTextureCube(e,0):e.isData3DTexture?Y.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?Y.setTexture2DArray(e,0):Y.setTexture2D(e,0),K.unbindTexture()},this.resetState=function(){E=0,D=0,O=null,K.reset(),Fe.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return re}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=V._getDrawingBufferColorSpace(e),t.unpackColorSpace=V._getUnpackColorSpace()}},ei=class extends B{constructor(){super();let e=new G;e.deleteAttribute(`uv`);let t=new he({side:1}),n=new he,r=new s(16777215,900,28,2);r.position.set(.418,16.199,.3),this.add(r);let i=new X(e,t);i.position.set(-.757,13.219,.717),i.scale.set(31.713,28.305,28.591),this.add(i);let a=new P(e,n,6),o=new ae;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),a.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),a.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),a.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),a.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),a.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),a.setMatrixAt(5,o.matrix),this.add(a);let c=new X(e,ti(50));c.position.set(-16.116,14.37,8.208),c.scale.set(.1,2.428,2.739),this.add(c);let l=new X(e,ti(50));l.position.set(-16.109,18.021,-8.207),l.scale.set(.1,2.425,2.751),this.add(l);let u=new X(e,ti(17));u.position.set(14.904,12.198,-1.832),u.scale.set(.15,4.265,6.331),this.add(u);let d=new X(e,ti(43));d.position.set(-.462,8.89,14.52),d.scale.set(4.38,5.441,.088),this.add(d);let f=new X(e,ti(20));f.position.set(3.235,11.486,-12.541),f.scale.set(2.5,2,.1),this.add(f);let p=new X(e,ti(100));p.position.set(0,20,0),p.scale.set(1,.1,1),this.add(p)}dispose(){let e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(let t of e)t.dispose()}};function ti(e){return new Pe({color:0,emissive:16777215,emissiveIntensity:e})}function ni(e,t=!1){let n=e[0].index!==null,r=new Set(Object.keys(e[0].attributes)),i=new Set(Object.keys(e[0].morphAttributes)),a={},o={},s=e[0].morphTargetsRelative,c=new Ae,l=0;for(let u=0;u<e.length;++u){let d=e[u],f=0;if(n!==(d.index!==null))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.`),null;for(let e in d.attributes){if(!r.has(e))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have compatible attributes; make sure "`+e+`" attribute exists among all geometries, or in none of them.`),null;a[e]===void 0&&(a[e]=[]),a[e].push(d.attributes[e]),f++}if(f!==r.size)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. Make sure all geometries have the same number of attributes.`),null;if(s!==d.morphTargetsRelative)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. .morphTargetsRelative must be consistent throughout all geometries.`),null;for(let e in d.morphAttributes){if(!i.has(e))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`.  .morphAttributes must be consistent throughout all geometries.`),null;o[e]===void 0&&(o[e]=[]),o[e].push(d.morphAttributes[e])}if(t){let e;if(n)e=d.index.count;else if(d.attributes.position!==void 0)e=d.attributes.position.count;else return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. The geometry must have either an index or a position attribute`),null;c.addGroup(l,e,u),l+=e}}if(n){let t=0,n=[];for(let r=0;r<e.length;++r){let i=e[r].index;for(let e=0;e<i.count;++e)n.push(i.getX(e)+t);t+=e[r].attributes.position.count}c.setIndex(n)}for(let e in a){let t=ri(a[e]);if(!t)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` attribute.`),null;c.setAttribute(e,t)}for(let e in o){let t=o[e][0].length;if(t===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[e]=[];for(let n=0;n<t;++n){let t=[];for(let r=0;r<o[e].length;++r)t.push(o[e][r][n]);let r=ri(t);if(!r)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` morphAttribute.`),null;c.morphAttributes[e].push(r)}}return c}function ri(e){let t,n,r,i=-1,a=0;for(let o=0;o<e.length;++o){let s=e[o];if(t===void 0&&(t=s.array.constructor),t!==s.array.constructor)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes.`),null;if(n===void 0&&(n=s.itemSize),n!==s.itemSize)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes.`),null;if(r===void 0&&(r=s.normalized),r!==s.normalized)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes.`),null;if(i===-1&&(i=s.gpuType),i!==s.gpuType)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes.`),null;a+=s.count*n}let o=new t(a),s=new Ce(o,n,r),c=0;for(let t=0;t<e.length;++t){let r=e[t];if(r.isInterleavedBufferAttribute){let e=c/n;for(let t=0,i=r.count;t<i;t++)for(let i=0;i<n;i++){let n=r.getComponent(t,i);s.setComponent(t+e,i,n)}}else o.set(r.array,c);c+=r.count*n}return i!==void 0&&(s.gpuType=i),s}function ii(e){let t=[],n={value:0},r=e=>(t.push(e),e),i=r(new he({color:1781808,roughness:.94,metalness:.08})),a=r(new M(65,65,72,72)),o=a.attributes.position;for(let e=0;e<o.count;e++){let t=o.getX(e),n=o.getY(e);o.setZ(e,Math.sin(t*.7+n*.23)*.11+Math.cos(n*.31-t*.8)*.08+Math.sin(t*3.1+n)*.018)}a.computeVertexNormals();let s=new X(a,i);s.rotation.x=-Math.PI/2,s.position.set(0,-3.9,-14),e.add(s);function c(e){let t=e.onBeforeCompile;e.onBeforeCompile=e=>{t?.(e),e.uniforms.waterTime=n,e.vertexShader=`varying vec3 waterWorld;
`+e.vertexShader,e.vertexShader=e.vertexShader.replace(`#include <project_vertex>`,`waterWorld=(modelMatrix*vec4(transformed,1.)).xyz;
#include <project_vertex>`),e.fragmentShader=`varying vec3 waterWorld;uniform float waterTime;
`+e.fragmentShader,e.fragmentShader=e.fragmentShader.replace(`#include <color_fragment>`,`#include <color_fragment>
        vec2 wp=waterWorld.xz*.9+waterWorld.y*.15;
        float a=sin(wp.x*2.1+sin(wp.y*2.3+waterTime*.38))+sin(wp.y*2.8-waterTime*.29+cos(wp.x*1.7));
        float b=sin(wp.x*2.3+wp.y*.8-waterTime*.24)+cos(wp.y*2.4+sin(wp.x*2.+waterTime*.31));
        float c=pow(max(0.,1.-abs(a+b)*.62),8.);
        diffuseColor.rgb*=.92+c*.16;
        diffuseColor.rgb+=vec3(.012,.03,.027)*c;`)};let r=e.customProgramCacheKey.bind(e)();e.customProgramCacheKey=()=>r+`marine-caustics-v3`,e.needsUpdate=!0}c(i);let l=r(new Ae),u=new Float32Array(720),d=new Float32Array(720);for(let e=0;e<240;e++){let t=Math.sin(e*127.1+31.7)*43758.5453,n=Math.sin(e*269.5+83.2)*24634.6345,r=Math.sin(e*419.2+17.9)*56445.234;d.set([(t-Math.floor(t)-.5)*22,(n-Math.floor(n)-.5)*11,5-(r-Math.floor(r))*31],e*3)}l.setAttribute(`position`,new Ce(u,3));let f=r(new N({color:11125176,size:.022,transparent:!0,opacity:.3,depthWrite:!1,sizeAttenuation:!0})),p=new Be(l,f);e.add(p);let m=new Ke;e.add(m);let h=r(new He({transparent:!0,depthWrite:!1,side:1,uniforms:{localCamera:{value:new b},time:n,age:{value:0},strength:{value:0}},vertexShader:`varying vec3 vLocal;void main(){vLocal=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`
      varying vec3 vLocal;uniform vec3 localCamera;uniform float time,age,strength;
      float hash(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
      float noise3(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
      void main(){
        vec3 dir=normalize(vLocal-localCamera),inv=1./dir;
        vec3 a=(-.5-localCamera)*inv,b=(.5-localCamera)*inv,lo=min(a,b),hi=max(a,b);
        float near=max(max(lo.x,lo.y),lo.z),far=min(min(hi.x,hi.y),hi.z);near=max(near,0.);
        if(near>=far)discard;
        float stepSize=(far-near)/28.,jitter=hash(vec3(gl_FragCoord.xy,age));vec4 sum=vec4(0.);
        for(int i=0;i<28;i++){
          vec3 q=localCamera+dir*(near+(float(i)+jitter)*stepSize);
          float along=clamp(q.z+.5,0.,1.);
          vec2 curl=vec2(sin(q.z*11.-age*2.3+sin(q.y*8.)),cos(q.z*9.+age*1.8+cos(q.x*7.)))*(.025+along*.055+age*.004);
          float n=noise3(q*15.+vec3(age*.28,-age*.52,age*.2))*.76+noise3(q*34.-age*.31)*.24;
          float radius=.055+along*(.13+age*.006),r=length(q.xy+curl);
          float mass=exp(-2.6*r*r/max(.001,radius*radius));
          float shear=.7+.3*sin(along*27.+atan(q.y,q.x)*2.-age*2.4+n*4.);
          float density=mass*(.32+n*.68)*shear*smoothstep(.015,.16,along)*(1.-smoothstep(.7,1.,along));
          float alpha=1.-exp(-density*stepSize*strength*4.1);
          vec3 col=mix(vec3(.08,.2,.24),vec3(.28,.42,.4),n*.7+along*.2);
          sum.rgb+=(1.-sum.a)*col*alpha;sum.a+=(1.-sum.a)*alpha;
        }
        gl_FragColor=vec4(sum.rgb/max(sum.a,.0001),sum.a);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`})),g=new X(r(new G(1,1,1)),h);g.renderOrder=4,m.add(g);let _=new oe;g.onBeforeRender=(e,t,n)=>{_.copy(g.matrixWorld).invert(),h.uniforms.localCamera.value.copy(n.position).applyMatrix4(_)};let v=r(new j(new Uint8Array(4096),32,32));for(let e=0;e<32;e++)for(let t=0;t<32;t++){let n=.5+.5*Math.sin(t*.63+Math.sin(e*.41))*Math.cos(e*.57-t*.21),r=n<.26?0:35+n*190,i=(e*32+t)*4;v.image.data.set([r,r,r,255],i)}v.wrapS=v.wrapT=ge,v.repeat.set(2,3),v.needsUpdate=!0;let y=r(new de({color:9289147,transmission:.98,thickness:.075,ior:1.333,roughness:.27,metalness:0,clearcoat:.04,transparent:!0,opacity:.28,depthWrite:!1,alphaMap:v,alphaTest:.025,side:2,attenuationColor:6002074,attenuationDistance:3.5})),x=[];for(let e=0;e<2;e++){let e=r(new M(1,1,40,12)),t=new X(e,y);t.renderOrder=3,m.add(t),x.push(t)}let S=new Float32Array(540),C=r(new Ae);C.setAttribute(`position`,new Ce(S,3));let w=r(new N({color:11979196,size:.035,transparent:!0,opacity:.34,depthWrite:!1})),T=new Be(C,w);m.add(T);let E=new b(0,0,-1),D=new b(0,0,-1),O=new b(0,0,-1),k=-100,A=``,ee=!1,P=!0;function te(){m.visible=P&&ee,p.visible=P,s.visible=!1}function F(e){let t=e.time;n.value=t;for(let e=0;e<240;e++){let n=d[e*3],r=d[e*3+1],i=d[e*3+2];u[e*3]=n+Math.sin(t*.23+r*.7+i*.16)*.18,u[e*3+1]=r+Math.sin(t*.17+n*.4)*.09,u[e*3+2]=5-(5-i+t*.075)%31}l.attributes.position.needsUpdate=!0,e.phase===`ESCAPE`&&A!==`ESCAPE`&&(k=t-Math.max(0,e.phaseTime||0)),A=e.phase;let r=Math.max(0,t-k),i=Math.max(0,1-r/5.2);if(ee=r<5.2&&e.species!==`algae`,te(),!ee)return;let a=Math.min(1,r*12)*i,o=e.species===`whale`?1.45:e.species===`jelly`?.8:1;E.fromArray(e.escapeDirection||[0,0,-1]).normalize(),O.copy(E),m.quaternion.setFromUnitVectors(D,E),m.position.set(0,e.species===`jelly`?.45:0,0),h.uniforms.age.value=r,h.uniforms.strength.value=a;let s=9+r*(e.species===`whale`?1.1:2.8),c=(2.2+r*.22)*o;g.scale.set(c,c*.82,s),g.position.z=.35-s*.5,y.opacity=a*.26,x.forEach((e,t)=>{let n=e.geometry.attributes.position;for(let e=0;e<n.count;e++){let i=e%41/40,a=Math.floor(e/41)/12,c=a*Math.PI*(1.1+t*.25)+t*1.9+i*(5.2+t*1.7)-r*.72,l=(.07+i*.18+r*.025)*(1+.25*Math.sin(i*25-r*2.7+a*5))*o;n.setXYZ(e,Math.cos(c)*l+Math.sin(i*9-r)*.09+Math.sin(i*4+t)*.12*i,Math.sin(c)*l+Math.cos(i*5+t*2)*.1*i,.25-i*s*(.68+t*.18))}n.needsUpdate=!0,e.geometry.computeVertexNormals()});for(let e=0;e<180;e++){let t=e/180,n=e*2.399+r*.65,i=(.06+t*.62+r*.055)*o;S[e*3]=Math.cos(n)*i+Math.sin(t*19-r*2)*.1,S[e*3+1]=Math.sin(n)*i+Math.cos(t*13-r)*.07,S[e*3+2]=.2-t*s*.9}C.attributes.position.needsUpdate=!0,w.opacity=a*.28}return{update:F,caustics:c,setVisible(e){P=e,te()},dispose(){m.removeFromParent(),p.removeFromParent(),s.removeFromParent();for(let e of t)e.dispose()},diagnostics:()=>({wake:`directional-raymarched-volume + refractive-open-sheets`,raySteps:28,causticSeabed:!1,suspendedParticles:240,wakeParticles:180,wakeDirection:O.toArray(),physicalFluidSimulation:!1})}}function ai({scanMap:e}={}){let t=new B,n=new Le(-1,1,1,-1,0,2);n.position.z=1;let r=new He({depthTest:!1,depthWrite:!1,toneMapped:!1,uniforms:{scanMap:{value:e},source:{value:null},pixel:{value:new m},time:{value:0}},vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`,fragmentShader:`
 uniform sampler2D source;uniform sampler2D scanMap;uniform vec2 pixel;uniform float time;varying vec2 vUv;
 float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
 void main(){
 vec2 uv=vUv;vec3 col=texture2D(source,uv).rgb;vec3 light=vec3(0.);
 for(int i=0;i<12;i++){float a=float(i)*2.39996;float r=2.+sqrt(float(i))*3.3;vec3 s=texture2D(source,uv+vec2(cos(a),sin(a))*pixel*r).rgb;float l=dot(s,vec3(.2126,.7152,.0722));light+=s*smoothstep(.22,.75,l)*exp(-r*r/180.)/5.8;}
 col+=light*.65;
 vec2 cellSize=vec2(12.,16.);vec2 cell=floor(gl_FragCoord.xy/cellSize);vec2 center=(cell+.5)*cellSize*pixel;
 vec3 sampleColor=texture2D(source,center).rgb;float luminance=dot(sampleColor,vec3(.2126,.7152,.0722));
 float mask=smoothstep(.065,.22,luminance);
 float region=hash(floor(cell/vec2(4.,5.)));float cluster=smoothstep(.4,.66,sin(center.x*11.+center.y*16.+time*.13)+region*.65);
 float glyphIndex=mod(floor(luminance*15.)+floor(hash(cell)*6.),16.);vec2 letter=fract(gl_FragCoord.xy/cellSize);
 float glyph=texture2D(scanMap,vec2((glyphIndex+letter.x)/16.,1.-letter.y)).r;
 float ink=glyph*mask*cluster*.72;
 col+=vec3(.12,.46,.85)*mask*cluster*.09;col=mix(col,mix(vec3(.36,.78,1.),vec3(1.,.77,.73),hash(cell)*.55),ink);
 float paperTile=step(.985,region)*mask*.12;col=mix(col,vec3(.5,.72,.95),paperTile);
 col=mix(vec3(dot(col,vec3(.2126,.7152,.0722))),col,.72);
 col*=.94+.06*sin(gl_FragCoord.y*3.14159);
 col=floor(col*128.+hash(gl_FragCoord.xy)*.22)/128.;
 col*=1.-.23*pow(length((uv-.5)*1.3),2.);
 float grain=hash(gl_FragCoord.xy*.73+floor(time*8.))-.5;float silver=hash(floor(gl_FragCoord.xy/2.)+13.)-.5;col+=vec3(grain*.009+silver*.003);
 gl_FragColor=vec4(col,1.);
 #include <colorspace_fragment>
 }`}),i=new M(2,2);return t.add(new X(i,r)),{render(e,i,a,o){r.uniforms.source.value=i.texture,r.uniforms.pixel.value.set(1/i.width,1/i.height),r.uniforms.time.value=o,e.setRenderTarget(a),e.render(t,n)},dispose(){i.dispose(),r.dispose()}}}function oi(){let e=new ze(45,32,20),t=new He({side:1,depthWrite:!1,fog:!1,uniforms:{},vertexShader:`varying vec3 p;void main(){p=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`
 varying vec3 p;
 float h(vec3 q){return fract(sin(dot(q,vec3(127.1,311.7,74.7)))*43758.5453);}
 float n(vec3 q){vec3 i=floor(q),f=fract(q);f=f*f*(3.-2.*f);return mix(mix(mix(h(i),h(i+vec3(1,0,0)),f.x),mix(h(i+vec3(0,1,0)),h(i+vec3(1,1,0)),f.x),f.y),mix(mix(h(i+vec3(0,0,1)),h(i+vec3(1,0,1)),f.x),mix(h(i+vec3(0,1,1)),h(i+vec3(1,1,1)),f.x),f.y),f.z);}
 void main(){vec3 d=normalize(p);float depth=smoothstep(-.75,.8,d.y);float cloud=n(d*5.)*.65+n(d*12.)*.23+n(d*27.)*.12;
 vec3 col=mix(vec3(.0015,.004,.013),vec3(.008,.045,.09),depth);col+=vec3(.003,.014,.024)*cloud;
 float shaft=pow(max(0.,sin(d.x*11.+d.z*7.+cloud*.8)),18.)*depth*.12;col+=vec3(.009,.04,.06)*shaft;
 gl_FragColor=vec4(col,1.);
#include <colorspace_fragment>
 }`}),n=new X(e,t);return n.name=`continuous-water-environment`,n.renderOrder=-100,{mesh:n,dispose(){e.dispose(),t.dispose()}}}function si(e){let t=Math.max(0,Math.min(1,(e.envelope||e.level||0)/.15)),n=e.phase===`ECHO`?.28+.45*Math.sin((e.phaseTime||0)*3)**2:0;return Math.max(t,n)}function ci(){let e=new B,t=oi();e.add(t.mesh);let n=new ce(35,800/728,.1,80);n.position.set(0,0,4.3);let r=22e3,i=new Float32Array(r*3),a=new Float32Array(r),o=new Float32Array(r),s=new Float32Array(r*3),c=[10472138,12831392,12952497,9090504,8891045,11641028,14006915,12947882,10601909].map(e=>new U(e));for(let e=0;e<r;e++){let t=(Math.sin(e*127.1+3.7)*43758.5453%1+1)%1,n=1-2*(e+.5)/r,l=e*2.399963,u=Math.sqrt(1-n*n),d=.68+.32*t**.28;i.set([Math.cos(l)*u*d,n*d,Math.sin(l)*u*d],e*3),a[e]=t,o[e]=+(e%5==0&&t>.82);let f=e%5==0?c[e%9]:new U(14214119);s.set([f.r,f.g,f.b],e*3)}let l=new Ae;l.setAttribute(`position`,new Ce(i,3)),l.setAttribute(`seed`,new Ce(a,1)),l.setAttribute(`accent`,new Ce(o,1)),l.setAttribute(`color`,new Ce(s,3));let u=new He({transparent:!0,depthWrite:!1,vertexColors:!0,uniforms:{time:{value:0},energy:{value:0},influence:{value:0},contact:{value:new b}},vertexShader:`
 attribute float seed;attribute float accent;varying vec3 tint;varying float density;uniform float time;uniform float energy;uniform float influence;uniform vec3 contact;
 void main(){vec3 p=position;float fold=sin(p.x*6.+time*.23)*sin(p.y*5.-time*.17)*cos(p.z*7.+time*.13);
 float ridge=sin(p.y*8.+sin(p.x*5.)+time*.19);p*=1.+fold*(.12+influence*.17);p.x+=sin(p.y*4.+time*.21)*(.035+influence*.1);p.y+=cos(p.z*5.-time*.16)*(.04+influence*.1);
 float d=exp(-dot(p.xy-contact.xy,p.xy-contact.xy)*5.);p.z+=d*contact.z*.13;
 p*=min(1.,1.28/max(length(p),.001));vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;gl_PointSize=clamp((1.8+seed*.8+energy*.7)*4.3/-mv.z,1.,4.);
 gl_PointSize*=1.+accent*.7;tint=color*(1.25+energy*.45+accent*.5);density=.5+.48*smoothstep(-.5,.6,ridge+fold);
 }`,fragmentShader:`varying vec3 tint;varying float density;void main(){vec2 p=gl_PointCoord-.5;float a=exp(-dot(p,p)*14.)*density;if(a<.025)discard;gl_FragColor=vec4(tint,a);
#include <colorspace_fragment>}`}),d=new Be(l,u);d.frustumCulled=!1,e.add(d);let f=0;return{scene:e,camera:n,update(e){f=si(e),u.uniforms.time.value=e.time||0,u.uniforms.energy.value=f,u.uniforms.influence.value=f*10;let t=e.touch;u.uniforms.contact.value.set(t?.x||0,t?.y||0,t?.active?t.strength:0),n.position.z=4.3/(e.view?.zoom||1)},diagnostics:()=>({kind:`luminous-granular-organism`,particles:r,energy:f,influence:f*10,responseGain:10,audioReactive:!0,orientationLocked:!0}),dispose(){l.dispose(),u.dispose(),t.dispose(),e.clear()}}}function li(){let e=document.createElement(`canvas`);e.width=512,e.height=32;let t=e.getContext(`2d`);t.fillStyle=`#000`,t.fillRect(0,0,512,32),t.font=`20px "FS Pixel"`,t.textAlign=`center`,t.textBaseline=`middle`,t.fillStyle=`#fff`;for(let e=0;e<16;e++)t.fillText(`SX80G#@%+:.=~*/`[e]||`+`,e*32+16,16);let n=new ve(e);return n.colorSpace=Ie,n.minFilter=n.magFilter=be,n.generateMipmaps=!1,n}var ui=[`jelly`,`fish`,`mollusc`,`whale`,`shark`,`angelfish`,`butterflyfish`,`tang`,`algae`];function di(e,t){let n=ui[e%9],r=Math.floor(e/9),i=e*2.399963;if(n===`algae`)return{x:-5+r*5,y:-3.4,z:-5-r*7};if(n===`jelly`){let e=t*.13+i;return{x:Math.sin(e*.38)*5.5,y:Math.sin(e)*2.7+.055*Math.sin(t*1.35),z:-10+Math.cos(e*.31+i)*9}}let a=t*(n===`whale`?.055:n===`shark`?.085:n===`mollusc`?.035:n===`fish`?.1:.13)+i,o=n===`whale`?8:6.7,s=n===`whale`?13:10;return{x:Math.sin(a)*o,y:Math.sin(a*.51+i)*(n===`mollusc`?.45:n===`whale`?.6:1.6)+(n===`mollusc`?-2.6:0),z:-12+Math.cos(a)*s}}function fi(e,t){let n=ui[e%9],r=di(e,t),i=di(e,t-.02),a=di(e,t+.02),o=(a.x-i.x)/.04,s=(a.y-i.y)/.04,c=(a.z-i.z)/.04;return{...r,yaw:n===`algae`?0:n===`jelly`?Math.sin(t*.06+e)*.08:Math.atan2(c,-o),pitch:n===`algae`||n===`jelly`?0:-Math.atan2(s,Math.hypot(o,c)),scale:n===`whale`?.8+Math.floor(e/9)*.13:.65+e%3*.2,vx:o,vy:s,vz:c}}var pi=Math.PI*2,mi=e=>Math.max(0,Math.min(1,e)),hi=(e,t,n)=>e+(t-e)*n;function gi({scene:e,keep:t,glass:n,pink:r,chrome:i,brass:a,dark:o,organ:c,board:l}){let u={},d={whale:7575970,shark:8234901,angelfish:11115446,butterflyfish:11903354,tang:11635865,algae:9548450};function f(r){let f=new Ke;f.name=`marine.${r}`,e.add(f),u[r]=f;let p=t(n.clone());p.color.set(d[r]).lerp(new U(14085095),.35),p.transmission=.98,p.thickness=.085,p.attenuationColor.set(d[r]),p.attenuationDistance=2.5,p.roughness=.14,p.clearcoat=.06,p.emissive.set(d[r]),p.emissiveIntensity=.025;let m=t(p.clone());m.side=2,m.color.lerp(new U(14082524),.42),m.transmission=.94,m.thickness=.012,m.attenuationDistance=.72,m.roughness=.25,m.emissiveIntensity=.12,m.iridescence=.24,m.iridescenceIOR=1.32,m.iridescenceThicknessRange=[160,340];let h=t(c.clone());h.color.set(d[r]).lerp(new U(10411985),.4),h.emissive.set(d[r]),h.emissiveIntensity=.3,h.transmission=0,h.roughness=.32,h.iridescence=.18,h.iridescenceIOR=1.32,h.bumpMap=n.bumpMap,h.bumpScale=.018;let g=t(new he({color:12702907,emissive:d[r],emissiveIntensity:1.05,roughness:.45})),_=t(new he({color:d[r],emissive:d[r],emissiveIntensity:.18,roughness:.43,metalness:.18})),v=t(new he({color:new U(d[r]).multiplyScalar(.48),emissive:d[r],emissiveIntensity:.035,roughness:.5,metalness:.22})),y=new s(d[r],.45,3.2,2);y.position.set(-.25,.02,.08),f.add(y);for(let e of[-.7,.65]){let t=new s(d[r],.28,1.1,2);t.position.set(e,.04,.03),f.add(t)}let x=[];function S(e,n,r=0){t(e);let i=new X(e,n);return f.add(i),x.push({object:i,rest:e.attributes.position.array.slice(),flutter:r}),i}function C(e,t,n=h,r=18){let i=new ze(1,r,12);if(n===h&&r>=20){let e=i.attributes.position;for(let t=0;t<e.count;t++){let n=Math.atan2(e.getZ(t),e.getX(t)),r=1+.055*Math.cos(n*12)*Math.sin(Math.acos(Math.max(-1,Math.min(1,e.getY(t)))));e.setXYZ(t,e.getX(t)*r,e.getY(t),e.getZ(t)*r)}i.computeVertexNormals()}return i.scale(...t),i.translate(...e),S(i,n)}function E(e,t,n=i,r=24){return S(new T(new ue(e.map(e=>new b(...e))),r,t,5,!1),n)}function D(e,t,n,r,a=i){return E(Array.from({length:33},(i,a)=>[e,t+Math.cos(a/32*pi)*n,Math.sin(a/32*pi)*r]),.008,a,32)}function O(e,t=m,n=.02){let r=new ue(e.map(e=>new b(...e)),!0,`catmullrom`,.18),i=e.reduce((e,t)=>e.add(new b(...t)),new b).multiplyScalar(1/e.length),a=[],o=[],s=[];for(let e=0;e<=8;e++)for(let t=0;t<=56;t++){let n=e/8,s=r.getPoint(t/56),c=i.clone().lerp(s,n);c.z+=Math.sin(n*Math.PI)*.015,a.push(c.x,c.y,c.z),o.push(t/56,n)}for(let e=0;e<8;e++)for(let t=0;t<56;t++){let n=e*57+t,r=n+56+1;s.push(n,r,n+1,r,r+1,n+1)}let c=new Ae;c.setAttribute(`position`,new w(a,3)),c.setAttribute(`uv`,new w(o,2)),c.setIndex(s),c.computeVertexNormals();let l=S(c,t,n);E(r.getPoints(72).map(e=>e.toArray()),.0035,v,72);for(let e=0;e<9;e++){let t=r.getPoint(e/9),a=i.clone().lerp(t,.58);a.z+=.012,S(new T(new ue([i.clone(),a,t]),12,.003,4,!1),v,n)}return l}function k(e,t=76,n=40){function r(t){let n=0;for(;n<e.length-2&&t>e[n+1][0];)n++;let r=e[n],i=e[n+1],a=mi((t-r[0])/(i[0]-r[0])),o=a*a*(3-2*a);return[hi(r[1],i[1],o),Math.max(.001,hi(r[2],i[2],o)),Math.max(.001,hi(r[3],i[3],o))]}let i=[],a=[],o=[],s=e[0][0],c=e.at(-1)[0];for(let e=0;e<=t;e++)for(let o=0;o<=n;o++){let l=hi(s,c,e/t),[u,d,f]=r(l),p=o/n*pi;i.push(l,u+d*Math.cos(p),f*Math.sin(p)),a.push(e/t,o/n)}for(let e=0;e<t;e++)for(let t=0;t<n;t++){let r=e*(n+1)+t,i=r+n+1;o.push(r,r+1,i,r+1,i+1,i)}let l=new Ae;return l.setAttribute(`position`,new w(i,3)),l.setAttribute(`uv`,new w(a,2)),l.setIndex(o),l.computeVertexNormals(),S(l,p),r}function A(e,t=.065){for(let n of[-1,1]){let[r,a,s]=e;C([r,a,n*s],[t*1.25,t*1.25,t*.32],i,20),C([r,a,n*(s+.018)],[t,t,t*.28],o,20),C([r-t*.15,a+t*.17,n*(s+.035)],[t*.26,t*.26,t*.13],h,16)}}function j(e,t,n,r=16){let s=[];for(let c=0;c<r;c++){let l=hi(t,n,c/(r-1)),[u,d,f]=e(l);D(l,u,d*.71,f*.73,c%4?i:a),C([l,u,0],[.028,.048,.04],o,10),s.push([l,u,0])}E(s,.025,i,40);for(let e=1;e<r;e+=3){let[t,n]=s[e];C([t,n+.045,.035],[.025,.045,.022],g,12)}for(let e of[-1,1])E(s.map(([t,n])=>[t,n-.06,e*.075]),.008,_,40)}function M(e,t=1){let[n,r,i]=e,s=new G(.25*t,.18*t,.023*t);s.translate(n,r,i),S(s,l);for(let e=0;e<4;e++){let s=new G(.032*t,.045*t,.025*t);s.translate(n+(e-1.5)*.052*t,r,i+.018*t),S(s,o),C([n+(e-1.5)*.052*t,r+.06*t,i+.022*t],[.008,.013,.006],g,10),E([[n-.1*t,r-.065*t,i+.013*t],[n+(e-1.5)*.052*t,r-.065*t,i+.013*t],[n+(e-1.5)*.052*t,r-.018*t,i+.013*t]],.003,a,5)}}function ee(e,t={},n=`fish`,r=1){let i=t.phase===`ESCAPE`?mi((t.phaseTime||0)*2):0,a=e*r+(t.phase===`ESCAPE`?(t.phaseTime||0)*r*2.4:0),o=(n===`whale`?.13:.17)*(1+i*1.25);h.emissiveIntensity=.32+Math.sin(e*.9)*.07+(t.phase===`ECHO`?.34*Math.sin(e*5)**2:0),_.emissiveIntensity=.16+Math.sin(e*.7+1)*.04,y.intensity=.45+(t.phase===`ECHO`?.18*Math.sin(e*4)**2:0);for(let{object:r,rest:i,flutter:s}of x){let c=r.geometry.attributes.position;for(let r=0;r<c.count;r++){let l=i[r*3],u=i[r*3+1],d=i[r*3+2],f=mi((l+.9)/2.8)**2,p=Math.sin(a*2.2-l*1.6)*f*o,m=Math.sin(a*2.1+l*4.2+u*2.3)*s*(Math.abs(u)+Math.abs(d)),h=1+Math.sin(e*1.15)*.009*(1-f),g=t.touch,_=g?.active?Math.exp(-((l-g.x*1.6)**2+(u-g.y*1.5)**2)*2)*g.strength*.18:0;c.setXYZ(r,l,n===`whale`?u*h+p+m:u*h,n===`whale`?d+m+_:d+p+m+_)}c.needsUpdate=!0,r.geometry.computeVertexNormals(),r.geometry.computeBoundingSphere()}}function N(){let e=x.splice(0),t=new Map;for(let n of e){let e=`${n.object.material.uuid}:${n.flutter}`;t.has(e)||t.set(e,[]),t.get(e).push(n)}for(let e of t.values()){let t=ni(e.map(e=>e.object.geometry),!1);if(!t)throw Error(`Cannot batch ${r} anatomy.`);let[{object:{material:n},flutter:i}]=e;for(let t of e)f.remove(t.object);S(t,n,i)}}return f.userData.compile=N,{root:f,skin:p,fin:m,glow:h,tracer:_,parts:x,mesh:S,tube:E,ellipsoid:C,ring:D,membrane:O,body:k,optics:A,skeleton:j,circuit:M,animate:ee,compile:N}}let p=f(`whale`),m=p.body([[-1.86,.1,.001,.001],[-1.82,.1,.36,.32],[-1.68,.1,.52,.42],[-.98,.1,.54,.45],[-.52,.07,.49,.4],[.1,.02,.36,.32],[.7,0,.24,.22],[1.25,-.02,.12,.12],[1.7,-.02,.055,.065],[1.86,-.02,.001,.001]],100,48);p.skeleton(m,-.65,1.7,21),p.ellipsoid([-1.21,.16,0],[.4,.3,.235],p.glow,28);for(let e=0;e<6;e++)p.ring(-1.55+e*.13,.16,.35,.285,e%2?a:i);for(let e of[-1,1])p.tube([[-1.62,.16,e*.2],[-1.35,.28,e*.27],[-1.02,.25,e*.26],[-.83,.1,e*.18]],.012,a,28);p.ellipsoid([-.32,-.13,0],[.25,.2,.19],c,24),p.circuit([-.75,.06,.28],1.1),p.membrane([[-1.73,-.3,0],[-1.4,-.43,.09],[-.63,-.43,.08],[-.44,-.28,0],[-.72,-.43,-.08],[-1.4,-.43,-.09]],r,.003);for(let e of[-1,1]){p.tube([[-1.78,-.27,e*.2],[-1.35,-.35,e*.25],[-.8,-.34,e*.23],[-.57,-.22,e*.28]],.009,o,32),p.membrane([[-.56,-.2,e*.2],[-.27,-.31,e*.75],[.12,-.3,e*.63],[-.1,-.12,e*.24]],p.fin,.07),p.tube([[-.49,-.2,e*.25],[-.24,-.28,e*.6],[.06,-.28,e*.61]],.011,i,20),p.membrane([[1.38,-.02,0],[1.58,-.04,e*.82],[1.93,-.03,e*.72],[1.81,-.015,e*.12],[1.67,0,0]],p.fin,.04);for(let t=0;t<5;t++)p.tube([[1.47,-.02,e*.04],[1.64,-.025,e*(.2+t*.1)],[1.86,-.03,e*(.18+t*.12)]],.006,t%2?i:p.tracer,16);p.tube([[-1.5,.34,e*.25],[-.7,.37,e*.3],[.2,.24,e*.23],[1.34,.08,e*.07]],.006,p.tracer,40)}p.membrane([[.25,.3,0],[.65,.57,0],[.91,.18,0],[.58,.24,0]],p.fin,.015),p.optics([-.68,-.15,.36],.046),p.ellipsoid([-1.35,.59,-.1],[.07,.015,.045],o,16);for(let e=0;e<8;e++){let t=-1.5+e*.085;p.ring(t,.16,.26,.22,e%3?i:p.tracer)}p.root.userData.animate=(e,t)=>p.animate(e,t,`whale`,.55);let h=f(`shark`),g=h.body([[-1.85,.02,.001,.001],[-1.52,.02,.12,.14],[-1.12,.02,.29,.3],[-.58,.01,.38,.35],[.04,0,.31,.29],[.65,0,.19,.19],[1.27,.01,.07,.08],[1.55,.05,.025,.035],[1.69,.08,.001,.001]],88,44);h.skeleton(g,-1,1.5,20),h.membrane([[-.28,.31,0],[.02,1.01,0],[.39,.24,0],[.08,.27,0]],h.fin,.018),h.membrane([[.78,.13,0],[.99,.42,0],[1.17,.08,0]],h.fin,.025),h.membrane([[1.28,.02,0],[1.83,1.03,0],[1.94,.86,0],[1.68,.13,0],[1.81,-.52,0],[1.63,-.44,0]],h.fin,.055);for(let e of[-1,1]){h.membrane([[-.78,-.14,e*.22],[-.31,-.22,e*1.04],[.18,-.18,e*.84],[-.2,-.09,e*.25]],h.fin,.045),h.membrane([[.57,-.11,e*.12],[.86,-.23,e*.48],[1.04,-.13,e*.27]],h.fin,.04);for(let t=0;t<5;t++){let n=-1.01+t*.105,r=Array.from({length:8},(t,r)=>{let i=r/7,a=n+.065*i,o=.2-.4*i,[s,c,l]=g(a);return[a,o,e*(l*Math.sqrt(Math.max(.08,1-((o-s)/c)**2))+.013)]});h.tube(r,.013,o,20),h.tube(r.map(([t,n,r])=>[t-.016,n+.004,r-e*.003]),.0035,a,20)}h.tube([[-1.6,-.05,e*.08],[-1.39,-.12,e*.18],[-1.17,-.11,e*.25]],.008,o,24),h.tube([[-1.3,.11,e*.21],[-.4,.1,e*.32],[.52,.06,e*.19],[1.43,.04,e*.04]],.006,h.tracer,48),h.tube([[-.56,-.11,e*.23],[-.31,-.19,e*.89],[.1,-.17,e*.75]],.011,i,22)}for(let e=0;e<7;e++)h.tube([[1.4,.08,0],[1.57,.13+e*.08,0],[1.85,.21+e*.1,0]],.006,e%2?i:h.tracer,18);h.optics([-1.31,.1,.2],.048),h.ellipsoid([-.58,-.1,0],[.32,.17,.18],h.glow,24),h.circuit([-.22,.02,.21],.8);for(let e=0;e<10;e++){let t=-.72+e*.2,[n,r,a]=g(t);for(let e of[-1,1])h.tube([[t,n+r*.68,0],[t+.08,n,e*a*.7],[t+.14,n-r*.6,0]],.006,i,16)}h.root.userData.animate=(e,t)=>h.animate(e,t,`fish`,.85);function _(e,t){let n=f(e),r=t===`angel`,s=t===`butterfly`,c=r?.71:s?.7:.56,l=n.body([[-1.23,.02,.001,.001],[-1.12,.02,.12,.085],[-.88,.02,c*.67,.16],[-.5,0,c*.98,.24],[0,0,c,.26],[.52,0,c*.57,.19],[.86,0,.11,.09],[1.02,0,.035,.03],[1.08,0,.001,.001]],72,40);if(n.skeleton(l,-.75,.89,14),r){n.membrane([[-.68,.38,0],[-.34,1.39,0],[.53,.44,0],[.76,.16,0],[.13,.59,0]],n.fin,.055),n.membrane([[-.7,-.32,0],[-.33,-1.24,0],[.6,-.34,0],[.16,-.57,0]],n.fin,.06);for(let e of[-1,1])n.tube([[-.7,-.35,e*.1],[-.82,-.89,e*.12],[-.67,-1.47,e*.13]],.009,n.tracer,32)}else n.membrane([[-.82,.36,0],[-.56,c+.3,0],[.26,c+.2,0],[.74,.2,0],[.2,c*.7,0]],n.fin,.045),n.membrane([[-.51,-.46,0],[-.24,-c-.25,0],[.58,-.43,0],[.75,-.18,0]],n.fin,.05);n.membrane([[.88,0,0],[1.42,.53,0],[1.34,.1,0],[1.35,-.1,0],[1.42,-.53,0]],n.fin,.06);for(let e=0;e<9;e++)n.tube([[.86,0,0],[1.12,(e-4)*.05,0],[1.38,(e-4)*.12,0]],.004,e%3?i:n.tracer,16);for(let e of[-1,1]){n.membrane([[-.63,-.04,e*.2],[-.16,-.27,e*.68],[.18,-.09,e*.45],[-.19,.1,e*.23]],n.fin,.13),n.tube([[-.64,.32,e*.16],[-.52,.08,e*.25],[-.52,-.26,e*.18]],.01,i,20),n.tube([[-.9,.1,e*.13],[-.3,.06,e*.247],[.36,.02,e*.21],[.87,0,e*.07]],.006,n.tracer,32);for(let t=0;t<3;t++){let r=-.62+t*.43,[i,a,c]=l(r),u=Array.from({length:20},(t,n)=>{let o=.14+n/19*(Math.PI-.28);return[r+Math.sin(o)*.07,i+Math.cos(o)*a*.99,e*Math.sin(o)*c*1.015]});n.tube(u,s?.025:.017,t===1?o:n.tracer,24)}t===`tang`&&n.membrane([[.73,.08,e*.1],[.94,.13,e*.13],[.91,-.07,e*.12]],a,.008)}for(let e=0;e<8;e++){let t=-.5+e*.13,i=r?1.22-(t+.32)*1.13:c+.22-(t+.2)*.15;n.tube([[t,c*.48,0],[t+.1,i*.7,0],[t+.2,Math.max(.2,i),0]],.004,e%2?a:n.tracer,18)}n.optics([-.88,.13,.143],.062),n.ellipsoid([-.24,-.06,0],[.23,.27,.14],n.glow,22),n.circuit([-.05,.17,.17],.65),s&&(n.ellipsoid([.34,.31,.2],[.095,.11,.025],o,20),n.ellipsoid([.34,.31,.227],[.037,.045,.008],n.glow,16));for(let e=0;e<7;e++){let t=-.66+e*.19,[r,o,c]=l(t);for(let e of[-1,1])n.tube([[t,r+o*.72,0],[t+.035,r+.05,e*c*.78],[t+.08,r-o*.67,0]],.004,s?a:i,16)}n.root.userData.animate=(e,t)=>n.animate(e,t,`fish`,r?.8:s?1:1.2)}_(`angelfish`,`angel`),_(`butterflyfish`,`butterfly`),_(`tang`,`tang`);let v=f(`algae`);v.fin.transmission=.78,v.fin.thickness=.035,v.fin.roughness=.31;let y=t(n.clone());y.color.set(9351072),y.attenuationColor.set(7969934),y.transmission=.84,y.thickness=.075,y.roughness=.24,y.emissive.set(5534824),y.emissiveIntensity=.08;for(let e=0;e<11;e++){let t=e*2.39996,n=2.25+(Math.sin(e*5.13)*.5+.5)*1.4,r=[Math.cos(t)*.2,-1.45,Math.sin(t)*.18],i=[.38+Math.cos(t)*.5,0,Math.sin(t)*.55],o=t*.32+e%3*.42,s=[Math.cos(o),0,Math.sin(o)],c=[],l=[],u=[],d=[],f=[];for(let t=0;t<=56;t++){let a=t/56,o=[r[0]+i[0]*a*a+Math.sin(a*5.5+e)*.22*a,r[1]+a*n,r[2]+i[2]*a*a+Math.cos(a*4+e)*.14*a],u=(.018+Math.sin(a*Math.PI)**.7*(.13+e%3*.035))*(1-a*.48)*(1+.1*Math.sin(a*31+e));d.push(o),f.push(u);for(let t=0;t<=8;t++){let n=t/8*2-1,r=Math.sin(a*35+e*2)*.028*n*n;c.push(o[0]+s[0]*u*n,o[1]+r,o[2]+s[2]*u*n+Math.sin(a*9+e)*.055*n*n),l.push(t/8,a)}}for(let e=0;e<56;e++)for(let t=0;t<8;t++){let n=e*9+t,r=n+8+1;u.push(n,r,n+1,r,r+1,n+1)}let p=new Ae;p.setAttribute(`position`,new w(c,3)),p.setAttribute(`uv`,new w(l,2)),p.setIndex(u),p.computeVertexNormals(),v.mesh(p,v.fin);for(let e=0;e<12;e++){let t=4+e*4,n=d[t];for(let e of[-1,1])v.tube([n,[n[0]+s[0]*f[t]*e*.5,n[1]+.025,n[2]+s[2]*f[t]*e*.5],[n[0]+s[0]*f[t]*e*.88,n[1]+.018,n[2]+s[2]*f[t]*e*.88]],.0025,v.tracer,5)}v.tube(d,.008,e%3?v.tracer:a,52);for(let e=0;e<3;e++){let t=.25+e*.22,n=Math.round(t*56),r=d[n],i=e%2?1:-1;v.ellipsoid([r[0]+s[0]*i*.065,r[1],r[2]+s[2]*i*.065],[.072,.112,.064],y,22);for(let e of[-1,1]){let t=[r[0]+s[0]*f[n]*e*.9,r[1]+.035,r[2]+s[2]*f[n]*e*.9];v.tube([r,[(r[0]+t[0])*.5,r[1]+.055,(r[2]+t[2])*.5],t],.0035,v.tracer,10)}}}for(let e=0;e<9;e++){let t=e/9*pi;v.tube([[0,-1.43,0],[Math.cos(t)*.28,-1.52,Math.sin(t)*.28],[Math.cos(t)*.5,-1.51,Math.sin(t)*.5]],.017,e%3?i:a,18)}let x=new We(.18,.26,.15,24);x.translate(0,-1.46,0),v.mesh(x,o),v.circuit([0,-1.37,.17],.7),v.root.userData.animate=(e,t={})=>{let n=t.phase===`ESCAPE`?1.35:1;v.glow.emissiveIntensity=.36+Math.sin(e*.6)*.08+(t.phase===`ECHO`?.35:0),v.tracer.emissiveIntensity=.14+Math.sin(e*.45)*.035;for(let{object:r,rest:i}of v.parts){let a=r.geometry.attributes.position;for(let r=0;r<a.count;r++){let o=i[r*3],s=i[r*3+1],c=i[r*3+2],l=mi((s+1.45)/3.7)**1.45,u=t.touch?.active?Math.exp(-((o-t.touch.x*1.6)**2+(s-t.touch.y*1.5)**2)*2)*t.touch.strength*.18:0;a.setXYZ(r,o+Math.sin(e*.72-s*1.7+c*3)*l*.23*n,s-Math.sin(e*.4+o)*l*.04,c+Math.cos(e*.53-s*1.2+o*2)*l*.18*n+u)}a.needsUpdate=!0,r.geometry.computeVertexNormals(),r.geometry.computeBoundingSphere()}};for(let e of Object.values(u))e.userData.compile();return u}var _i=Math.PI*2,vi=e=>Math.max(0,Math.min(1,e)),yi=e=>{let t=vi(e);return t*t*(3-2*t)},bi=e=>{let t=Math.sin(e*127.1+31.7)*43758.5453;return t-Math.floor(t)},xi={jelly:{scale:1,yaw:.08,pitch:.13,approachX:.7,approachY:-1.4,escapeX:1.6,escapeY:2.2,escapeZ:23,turn:.65,roll:.08,detail:[1.9,.65,2.1],focus:[.05,.45,0]},fish:{scale:1,yaw:-.25,pitch:.08,approachX:-2.8,approachY:.5,escapeX:5.5,escapeY:1.4,escapeZ:25,turn:-1.1,roll:.16,detail:[-.1,1.5,2.4],focus:[-.2,.1,0]},mollusc:{scale:1,yaw:.06,pitch:.08,approachX:1.8,approachY:.5,escapeX:-3.5,escapeY:.6,escapeZ:18,turn:.8,roll:.18,detail:[-.1,1.5,2.4],focus:[-.2,.1,0]},whale:{scale:1.05,yaw:-.26,pitch:.17,approachX:-1.1,approachY:.45,escapeX:.8,escapeY:.45,escapeZ:23,turn:-.2,roll:.018,detail:[-1.65,.65,2.65],focus:[-.9,.1,0]},shark:{scale:1,yaw:-.22,pitch:.035,approachX:2.2,approachY:.4,escapeX:7,escapeY:1.4,escapeZ:18,turn:-.8,roll:.08,detail:[-1.6,.65,1.85],focus:[-.72,.02,0]},angelfish:{scale:.95,yaw:-.3,pitch:.04,approachX:-1.8,approachY:-.4,escapeX:3.4,escapeY:1.8,escapeZ:23,turn:-.85,roll:.12,detail:[-.25,.35,2.4],focus:[-.15,.08,0]},butterflyfish:{scale:1.05,yaw:-.32,pitch:.04,approachX:1.7,approachY:-.35,escapeX:-3.6,escapeY:1.2,escapeZ:24,turn:.9,roll:-.1,detail:[-.25,.35,2.35],focus:[-.12,.08,0]},tang:{scale:1.1,yaw:-.26,pitch:.04,approachX:-1.5,approachY:.3,escapeX:4.5,escapeY:.7,escapeZ:26,turn:-1.05,roll:.08,detail:[-.15,.35,2.3],focus:[-.05,.03,0]},algae:{scale:1,yaw:.08,pitch:0,approachX:0,approachY:-1.5,escapeX:0,escapeY:0,escapeZ:1.4,turn:0,roll:0,detail:[1.1,.15,2.2],focus:[.15,-.05,0]}};function Si(e,t){let n=document.createElement(`canvas`);n.width=e,n.height=t;let r=new ve(n);return r.colorSpace=Ie,r.generateMipmaps=!1,r.minFilter=r.magFilter=I,{canvas:n,ctx:n.getContext(`2d`),texture:r}}function Ci({renderer:e}){if(!e?.isWebGLRenderer)throw TypeError(`MARINE views require the installation renderer.`);let t=new Set,n=e=>(t.add(e),e),r=e=>n(new de(e)),i=new j(new Uint8Array(65536),128,128);for(let e=0;e<16384;e++){let t=e%128,n=Math.floor(e/128),r=178+bi(e+73)*26+Math.sin(t*.27+Math.sin(n*.12)*2)*20+Math.sin(n*.19)*12;i.image.data.set([r,r,r,255],e*4)}i.wrapS=i.wrapT=ge,i.repeat.set(3,3),i.needsUpdate=!0,n(i);let a=n(li()),o=r({color:14149602,emissive:9751243,emissiveIntensity:.025,iridescence:.24,iridescenceIOR:1.34,transmission:.92,thickness:.11,ior:1.36,roughness:.12,sheen:.25,sheenColor:10799551,sheenRoughness:.6,metalness:0,clearcoat:.07,clearcoatRoughness:.3,attenuationColor:9288375,attenuationDistance:1.45,roughnessMap:i,thicknessMap:i,bumpMap:i,bumpScale:.009,side:0}),l=r({color:15392226,emissive:13216952,emissiveIntensity:.025,iridescence:.28,transmission:.9,thickness:.12,ior:1.35,roughness:.18,metalness:0,clearcoat:.06,clearcoatRoughness:.3,attenuationColor:13079974,attenuationDistance:1.6,roughnessMap:i,thicknessMap:i,bumpMap:i,bumpScale:.008,side:0}),f=e=>n(new he(e)),_=f({color:12636364,metalness:.48,roughness:.34}),y=f({color:9138268,metalness:.78,roughness:.38}),x=f({color:1320999,metalness:.58,roughness:.43}),S=r({color:10804177,emissive:5152664,emissiveIntensity:.45,roughness:.26,transmission:.12,thickness:.08,ior:1.36,bumpMap:i,bumpScale:.012}),D=f({color:2705987,metalness:.38,roughness:.42}),O=o.clone();n(O),O.thickness=.05,O.roughness=.2,O.emissiveIntensity=.16;let k=y;function A(e,t,r,i=[0,0,0],a=[1,1,1]){n(t);let o=new X(t,r);return o.position.set(...i),o.scale.set(...a),e.add(o),o}function M(e,t,n,r,i=32){return A(e,new T(new ue(t.map(e=>new b(...e))),i,n,7,!1),r)}function ee(e,t,n,r,i=28){return A(e,new ze(1,i,18),r,t,n)}function F(e,t,n,r,i=_){return A(e,new C(t,n,6,36),i,r)}function I(e,t,n=1){let r=new Ke;r.position.set(...t),r.scale.setScalar(n),e.add(r),A(r,new G(.3,.46,.045),D);for(let e=0;e<5;e++)A(r,new G(.04,.065,.04),e%2?_:x,[-.09+e%2*.18,-.16+e*.075,.035]),M(r,[[-.13,-.2+e*.075,.025],[.06,-.2+e*.075,.025],[.09,-.15+e*.075,.025]],.004,y,3);return A(r,new G(.095,.13,.06),x,[0,.04,.04]),r}let L=new B;L.background=new U(201518),L.fog=new g(401731,.025);let re=new ei,ie=new St(e),z=ie.fromScene(re,.025);re.dispose(),ie.dispose(),L.environment=z.texture,L.environmentIntensity=.65,L.add(new te(10338242,3359291,1.2));let se=new u(15786429,2.6);se.position.set(-4,6,5),L.add(se);let le=new u(12952238,1.05);le.position.set(4,1,-3),L.add(le);let fe=new u(10276555,1.8);fe.position.set(-4,-1,-3),L.add(fe);let pe=Si(512,512);n(pe.texture);let V=pe.ctx.createLinearGradient(0,0,0,512);V.addColorStop(0,`#02375f`),V.addColorStop(.35,`#031d3c`),V.addColorStop(1,`#020c23`),pe.ctx.fillStyle=V,pe.ctx.fillRect(0,0,512,512);for(let e=0;e<16;e++){let t=bi(e+22)*512,n=bi(e+33)*300,r=pe.ctx.createRadialGradient(t,n,0,t,n,180);r.addColorStop(0,`#508ee81a`),r.addColorStop(1,`#508ee800`),pe.ctx.fillStyle=r,pe.ctx.fillRect(0,0,512,512)}pe.texture.needsUpdate=!0;let H=oi();L.add(H.mesh);let W=new Ke;L.add(W);let K=n(new Ae),q=new Float32Array(330);for(let e=0;e<110;e++)q.set([(bi(e+71)-.5)*20,(bi(e+501)-.5)*11,-bi(e+901)*20],e*3);K.setAttribute(`position`,new Ce(q,3));let J=new Be(K,n(new N({color:12769230,size:.018,transparent:!0,opacity:.3,depthWrite:!1})));L.add(J);function Y(e,t,n,r=.025){let i=[],a=[],o=[],s=(e+1)*(t+1);for(let o=0;o<2;o++)for(let s=0;s<=e;s++)for(let c=0;c<=t;c++)i.push(...n(s/e,c/t*_i,o*r)),a.push(s/e,c/t);for(let n=0;n<2;n++)for(let r=0;r<e;r++)for(let e=0;e<t;e++){let i=n*s+r*(t+1)+e,a=i+t+1;n===0?o.push(i,i+1,a,i+1,a+1,a):o.push(i,a,i+1,i+1,a,a+1)}for(let n of[0,e])for(let e=0;e<t;e++){let r=n*(t+1)+e,i=r+s;n===0?o.push(r,i,r+1,r+1,i,i+1):o.push(r,r+1,i,r+1,i+1,i)}let c=new Ae;return c.setAttribute(`position`,new w(i,3)),c.setAttribute(`uv`,new w(a,2)),c.setIndex(o),c.computeVertexNormals(),c}function _e(e){return e.updateMatrix(),e.geometry.applyMatrix4(e.matrix),e.position.set(0,0,0),e.rotation.set(0,0,0),e.scale.set(1,1,1),e}let ye={active:!1};function be(e,t){let n=e.geometry.attributes.position;e.userData.restPositions||=n.array.slice();let r=e.userData.restPositions;for(let e=0;e<n.count;e++){let i=t(r[e*3],r[e*3+1],r[e*3+2]);ye.active&&(i[2]+=Math.exp(-((i[0]-ye.x*1.6)**2+(i[1]-ye.y*1.5)**2)*2)*ye.strength*.18),n.setXYZ(e,...i)}n.needsUpdate=!0,e.geometry.computeVertexNormals(),e.geometry.computeBoundingSphere()}function xe(e,t,r=.022){let i=n(new We(r,r,.017,6));i.rotateX(Math.PI/2);let a=n(new G(r*1.15,r*.18,.002)),o=new P(i,_,t.length),s=new P(a,x,t.length),c=new ae;t.forEach(({p:e,n:t},n)=>{let r=new b(...t).normalize();c.position.set(...e),c.quaternion.setFromUnitVectors(new b(0,0,1),r),c.updateMatrix(),o.setMatrixAt(n,c.matrix),c.position.addScaledVector(r,.01),c.updateMatrix(),s.setMatrixAt(n,c.matrix)}),e.add(o,s)}function Se(e,t,n,r){let i=new ue(t.map(e=>new b(...e))),a=new T(i,44,n,9,!1),o=a.attributes.position;for(let e=0;e<=44;e++){let t=i.getPointAt(e/44),r=(1-.78*(e/44)**.8)*(n>.06?1+Math.sin(e/44*Math.PI*14)*.14:1);for(let i=0;i<=9;i++){let a=e*10+i;o.setXYZ(a,t.x+(o.getX(a)-t.x)*r,t.y+(o.getY(a)-t.y)*r,t.z+(o.getZ(a)-t.z)*r*(n>.06?.48:1))}}return a.computeVertexNormals(),A(e,a,r)}function we(e,t,r,i,a,o=1){let s=[],c=[],l=[];for(let e=0;e<=32;e++)for(let n=0;n<=9;n++){let a=e/32,l=n/9,u=Math.sin(a*Math.PI)**.65*i;s.push(t[0]+a*r,t[1]+u*l,t[2]+o*l*l*(.06+Math.sin(a*7)*.035)),c.push(a,l)}for(let e=0;e<32;e++)for(let t=0;t<9;t++){let n=e*10+t,r=n+9+1;l.push(n,r,n+1,r,r+1,n+1)}let u=new Ae;u.setAttribute(`position`,new w(s,3)),u.setAttribute(`uv`,new w(c,2)),u.setIndex(l),u.computeVertexNormals();let d=n(a.clone());return d.side=2,d.thickness=.012,A(e,u,d)}let Te=r({color:7911100,emissive:4954795,emissiveIntensity:.5,roughness:.28}),Ee=r({color:10927516,emissive:8371629,emissiveIntensity:.45,roughness:.25}),ke=r({color:12886696,emissive:12875921,emissiveIntensity:.35,roughness:.3}),Z={},je=new Ke;L.add(je),Z.jelly=je;let Me=[];for(let e=0;e<=40;e++){let t=e/40*Math.PI*.59;Me.push(new m(Math.sin(t)*1.04,Math.cos(t)*.77+.52))}for(let e=40;e>=0;e--){let t=e/40*Math.PI*.59;Me.push(new m(Math.max(.001,Math.sin(t)*1.04-.028),Math.cos(t)*.77+.49))}let Pe=new p(Me,96),Fe=Pe.attributes.position;for(let e=0;e<Fe.count;e++){let t=Fe.getX(e),n=Fe.getZ(e),r=Fe.getY(e),i=Math.atan2(n,t),a=vi((.9-r)/.65),o=1+Math.cos(i*12)*.035*a;Fe.setXYZ(e,t*o,r+Math.cos(i*12)*.028*a,n*o)}Pe.computeVertexNormals();let Re=[A(je,Pe,o)],Ve=[],He=[];for(let e=0;e<=96;e++){let t=e/96*_i,n=.999*(1+.035*Math.cos(t*12));He.push([Math.cos(t)*n,.302+Math.cos(t*12)*.028,Math.sin(t)*n])}Re.push(M(je,He,.023,l,96));let Ue=new Ke;je.add(Ue);let Ge=A(Ue,new We(.14,.19,.54,36),x,[0,.58,0]);for(let e=0;e<7;e++)F(Ue,.17+Math.sin(e/6*Math.PI)*.045,.009,[0,.34+e*.074,0],e%2?y:_).rotation.x=Math.PI/2;A(Ue,new We(.22,.22,.026,36),_,[0,.87,0]);for(let e of[-1,1])ee(Ue,[e*.24,.67,.04],[.14,.27,.11],S,24),M(Ue,[[e*.12,.82,0],[e*.3,.65,.12],[e*.21,.38,.1],[0,.27,0]],.012,y,24);I(Ue,[0,.57,.21],.65);let qe=F(Ue,.116,.012,[0,.27,0],Te);qe.rotation.x=Math.PI/2;for(let e=0;e<3;e++)A(Ue,new Ne(.014,.08,3,8),Te,[.2,.55+e*.07,.13]);let Je=[];for(let e=0;e<12;e++){let t=e/12*_i,n=Math.cos(t),r=Math.sin(t);M(Ue,[[n*.15,.9,r*.15],[n*.57,.88,r*.57],[n*.83,.59,r*.83],[n*.88,.31,r*.88]],.012,e%3?_:y,28);let i=M(je,[[n*.05,1.29,r*.05],[n*.6,1.12,r*.6],[n*.96,.71,r*.96],[n*1.02,.31,r*1.02]],.006,l,36);if(Re.push(i),Je.push({p:[n*.88,.32,r*.88],n:[n,.2,r]}),e%3==0){let e=A(Ue,new G(.06,.14,.035),x,[n*.72,.57,r*.72]);e.rotation.y=-t+Math.PI/2}let a=1.6+bi(e+119)*.85,o=.22+bi(e+217)*.25,s=-r,c=n,u=[[n*.92,.32,r*.92],[n*1.02,-.2,r*1.02],[n*1.04+s*.08,-.72,r*1.04+c*.08],[n*.78+s*o,-a*.78,r*.78+c*o],[n*.54+s*o*1.45,-a,r*.54+c*o*1.45],[n*.46+s*o*1.05,-a*.94,r*.46+c*o*1.05]];Ve.push(Se(je,u,e%3?.038:.125,e%3?O:l)),e%2==0&&Ve.push(Se(je,u,.004,k))}A(Ue,new p([new m(.08,-.63),new m(.22,-.48),new m(.29,-.12),new m(.2,.09),new m(.09,.17)],40),_,[0,.17,0]),F(Ue,.22,.012,[0,-.26,0],y).rotation.x=Math.PI/2,A(Ue,new We(.055,.055,.56,16),_,[0,-.65,0]),A(Ue,new We(.16,.16,.035,28),_,[0,-.94,0]);for(let e=0;e<8;e++){let t=e/8*_i,n=Math.cos(t),r=Math.sin(t),i=[[n*.52,.68,r*.52],[n*.9,.1,r*.9],[n*1.25,-.63,r*1.25],[n*1.45,-1.02,r*1.45]];Ve.push(M(je,i,.011,_,32));for(let e=1;e<4;e++){let t=e/3;Ve.push(_e(ee(je,[n*(.52+t*.82),.68-t*1.55,r*(.52+t*.82)],[.028,.028,.028],y,10)))}let a=we(je,[0,0,0],1.2,.2,O);a.position.set(n*.48,.14,r*.48),a.rotation.set(0,-t,-.72),Ve.push(_e(a))}xe(Ue,Je),je.userData.animate=(e,t={})=>{let n=t.phase===`ESCAPE`?yi((t.phaseTime||0)*3):0,r=e*1.35+(t.phase===`ESCAPE`?(t.phaseTime||0)*7:0),i=Math.max(0,Math.sin(r))**3*(.07+n*.16);Te.emissiveIntensity=.25+(t.phase===`ECHO`?.45:.12)*(.5+.5*Math.sin(r*2)),Re.forEach(e=>be(e,(e,t,n)=>{let r=vi((1.2-t)/.9),a=1-i*r;return[e*a,t+i*(.6-t)*.42,n*a]})),Ve.forEach(e=>be(e,(e,t,a)=>{let o=vi((.32-t)/2.6),s=Math.atan2(a,e),c=(Math.sin(r-o*4+s)*.16+Math.sin(r*.63-o*9+s)*.055)*o*o;return[e*(1-i*(1-o))+c,t-n*o*.22,a*(1-i*(1-o))+Math.cos(r*.7-o*5+s)*.15*o*o]})),Ue.rotation.y=Math.sin(e*.18)*.035,Ge.rotation.y=e*.045};let Xe=new Ke;L.add(Xe),Z.fish=Xe;function Ze(e){return .026+Math.sin(Math.PI*e)**.72*(.55-e*.36)}let Qe=[A(Xe,Y(76,52,(e,t,n)=>{let r=Math.max(.008,Ze(e)-n),i=-1.58+e*2.96,a=1+.045*Math.cos(t*6)*Math.sin(e*Math.PI);return[i,.03+Math.cos(t)*r*1.12*a,Math.sin(t)*r*.69*a]},.018),o)],Q=[];for(let e=0;e<13;e++){let t=.11+e/12*.79,n=-1.58+t*2.96,r=Ze(t),i=new Ke;i.position.x=n,Xe.add(i),Q.push({bone:i,x:n});let a=A(i,new We(.05,.05,.15,12),x);a.rotation.z=Math.PI/2;let o=F(i,r*.76,.01,[0,0,0],e%3?_:y);o.rotation.y=Math.PI/2,o.scale.x=.66,o.scale.y=1.09;for(let e of[-1,1])M(i,[[-.08,-.025,e*.03],[0,-.06,e*r*.48],[.08,-.02,e*r*.61]],.008,_,8);e%3==1&&A(i,new G(.035,.018,.06),Ee,[0,-.08,.045]),e<5&&xe(i,[{p:[0,0,r*.57],n:[0,0,1]},{p:[0,0,-r*.57],n:[0,0,-1]}],.014)}for(let e of[-1,1]){Qe.push(M(Xe,[[-1.1,-.08,e*.11],[-.35,-.12,e*.2],[.5,-.07,e*.1],[1.27,0,e*.025]],.009,y,48));let t=new Ke;Xe.add(t),t.position.set(-.73,.02,e*.21);for(let e=0;e<5;e++){let n=A(t,new G(.016,.23-e*.02,.023),x,[e*.04,0,0]);n.rotation.z=-.22}let n=A(Xe,new We(.072,.079,.035,32),_,[-1.15,.09,e*.19]);n.rotation.x=Math.PI/2;let r=A(Xe,new me(.048,24),x,[-1.15,.09,e*.211]);r.rotation.y=e>0?0:Math.PI,ee(Xe,[-1.15,.09,e*.215],[.05,.05,.018],o,24)}I(Xe,[-.38,-.02,.16],.83).rotation.z=Math.PI/2;let $=new Ke;$.position.x=1.2,Xe.add($);for(let e of[-1,1]){let t=we($,[0,0,0],.86,e*.63,l,e);Qe.push(t);for(let t=1;t<7;t++){let n=t/7,r=n*.86,i=Math.sin(n*Math.PI)**.65*e*.63;M($,[[0,0,0],[r*.48,i*.4,.015],[r,i,e*.035]],.005,t%2?_:y,14)}}let $e=we(Xe,[-.75,.2,0],1.85,.37,o);Qe.push($e);for(let e=0;e<9;e++){let t=(e+1)/10,n=-.75+t*1.85,r=Math.sin(t*Math.PI)**.65*.37;Qe.push(M(Xe,[[n,.16,0],[n+.035,.2+r*.5,.015],[n+.04,.2+r,.04]],.004,_,9))}let et=[];for(let e of[-1,1]){let t=new Ke;t.position.set(-.45,-.13,e*.19),t.rotation.x=e*1.1,Xe.add(t),et.push(t),we(t,[0,0,0],.8,-.34,o,e);for(let e=0;e<5;e++)M(t,[[0,0,0],[.2+e*.075,-.1-e*.017,0],[.35+e*.065,-.3+e*.025,.04]],.005,y,10)}Xe.userData.animate=(e,t={})=>{let n=t.phase===`ESCAPE`?yi((t.phaseTime||0)*3):0,r=e*2.1+(t.phase===`ESCAPE`?(t.phaseTime||0)*7.5:0),i=.11+n*.27;Ee.emissiveIntensity=.3+(t.phase===`ECHO`?.8:.15)*(.5+.5*Math.sin(e*2.5));let a=e=>Math.sin(e*2.2-r)*Math.max(0,(e+1.5)/2.9)**1.7*i;Qe.forEach(e=>{e.parent!==$&&be(e,(e,t,n)=>[e,t+Math.sin(r*.65+e)*.008,n+a(e)])}),Q.forEach(({bone:e,x:t})=>{e.position.z=a(t),e.rotation.y=-Math.atan2(a(t+.02)-a(t-.02),.04)}),$.position.z=a(1.2),$.rotation.y=-Math.atan2(a(1.22)-a(1.18),.04),$.children.filter(e=>e.geometry?.attributes.position.count>100).forEach(e=>be(e,(e,t,n)=>[e,t,n+Math.sin(r-e*3)*e*.08])),et.forEach((t,n)=>{t.rotation.x=(n?1:-1)*(1.1+Math.sin(e*1.1-n*.3)*.12),t.rotation.y=Math.sin(e*1.1)*.08})};for(let e=0;e<9;e++){let t=-.9+e*.22,n=Ze((t+1.58)/2.96),r=F(Xe,n*.8,.007,[t,.03,0],e%3?_:y);r.rotation.y=Math.PI/2,r.scale.x=.68,Qe.push(_e(r)),ee(Xe,[t,-.06,n*.35],[.015,.022,.012],Ee,12)}let tt=new Ke;L.add(tt),Z.mollusc=tt;let nt=[A(tt,Y(88,56,(e,t,n)=>{let r=Math.max(.008,.018+Math.sin(Math.PI*e)**.62*(.64-.26*e)-n),i=1+.055*Math.cos(t*7+e*2)+.035*Math.sin(e*Math.PI*24)*Math.sin(Math.PI*e);return[-1.65+e*3.18,.02+Math.sin(e*Math.PI)*.2+Math.cos(t)*r*i,Math.sin(t)*r*.83*i]},.024),l)],rt=[];for(let e=0;e<12;e++){let t=.14+e/11*.73,n=-1.65+t*3.18,r=Math.sin(t*Math.PI)*(.38-.12*t),i=new Ke;i.position.set(n,Math.sin(t*Math.PI)*.2,0),tt.add(i),rt.push({part:i,x:n,y:i.position.y});let a=F(i,r,.013,[0,0,0],e%4?_:y);a.rotation.y=Math.PI/2,a.scale.x=.74;let o=A(i,new We(.06,.06,.16,12),x);o.rotation.z=Math.PI/2,e%3==0&&(M(i,[[-.06,-.11,.12],[0,-.04,.15],[.06,-.08,.12]],.008,ke,12),ee(i,[0,-.12,.02],[.12,.16,.11],S,20),xe(i,[{p:[0,0,r*.73],n:[0,0,1]}],.018))}for(let e of[-1,1]){nt.push(M(tt,[[-1.25,.05,e*.12],[-.6,.35,e*.25],[.4,.25,e*.23],[1.35,-.02,e*.04]],.018,y,52));for(let t=0;t<7;t++){let n=.15+t*.11,r=we(tt,[-1.65+n*3.18-.17,-.03,e*(.35+.08*Math.sin(n*Math.PI))],.56,-.31,O,e);r.rotation.x=e*.38,nt.push(r)}}I(tt,[-.5,.16,.32],.7).rotation.z=Math.PI/2;let it=new Ke;it.position.set(-1.5,.08,0),tt.add(it);let at=A(it,new p([new m(.13,0),new m(.13,.12),new m(.18,.31),new m(.22,.42),new m(.2,.42),new m(.16,.3),new m(.11,.12),new m(.11,0)],40),o);at.rotation.z=Math.PI/2;for(let e=0;e<3;e++)F(it,.13+e*.022,.009,[-.1-e*.11,0,0],_).rotation.y=Math.PI/2;for(let e of[-1,1])nt.push(Se(tt,[[-1.18,.2,e*.16],[-1.4,.48,e*.24],[-1.45,.75,e*.25],[-1.3,.88,e*.22]],.038,o)),nt.push(Se(tt,[[.85,.3,e*.13],[1,.6,e*.21],[.98,.78,e*.25],[.88,.85,e*.22]],.026,o));for(let e=0;e<16;e++){let t=.12+e*.048,n=-1.65+t*3.18,r=F(tt,Math.sin(t*Math.PI)*(.49-.18*t),.006,[n,.02+Math.sin(t*Math.PI)*.2,0],e%4?o:y);r.rotation.y=Math.PI/2,r.scale.x=.83,nt.push(_e(r))}tt.userData.animate=(e,t={})=>{let n=t.phase===`ESCAPE`?yi((t.phaseTime||0)*3):0,r=e*1.45+(t.phase===`ESCAPE`?(t.phaseTime||0)*4:0);ke.emissiveIntensity=.2+(t.phase===`ECHO`?.38:.1)*(.5+.5*Math.sin(e*1.7));let i=e=>Math.sin(e*2.6-r)*(.065+n*.11);nt.forEach(e=>be(e,(e,t,a)=>{let o=1+Math.sin(e*3-r)*(.027+n*.02);return[e,t*o+i(e),a*o+Math.sin(e*1.8-r*.65)*.035]})),rt.forEach(({part:e,x:t,y:n})=>{e.position.y=n+i(t),e.rotation.z=Math.atan2(i(t+.02)-i(t-.02),.04)}),it.position.y=.08+i(-1.5),it.rotation.z=Math.cos(r+1.5)*.08},Object.assign(Z,gi({scene:L,keep:n,glass:o,pink:l,chrome:_,brass:y,dark:x,organ:S,board:D}));for(let[e,t]of Object.entries(Z))t.name=`marine.${e}`;for(let[e,t]of Object.entries(Z)){if(![`jelly`,`fish`,`mollusc`].includes(e))continue;let n=e===`jelly`?10472138:e===`fish`?12831392:12952497,r=f({color:n,emissive:n,emissiveIntensity:.65,roughness:.45});(e===`jelly`?[[0,.7,.12],[.24,.46,.08],[-.24,.46,.08]]:[[-.8,.1,.08],[0,.12,.07],[.7,.06,.03]]).forEach(([e,i,a],o)=>{let c=new s(n,.45,1.5,2);c.position.set(e,i,a),t.add(c),ee(t,[e,i,a],[.025,.055,.023],r,12)})}for(let[e,t]of Object.values(Z).entries()){t.updateMatrixWorld(!0);let i=[],a=[];t.traverse(t=>{let n=t.geometry;if(!t.isMesh||!n?.index||n.attributes.position.count<1500)return;let r=n.attributes.position,o=n.index,s=Math.min(600,Math.floor(o.count/18));for(let n=0;n<s;n++){let s=Math.floor(bi(n+e*719)*o.count/3)*3,c=new b().fromBufferAttribute(r,o.getX(s)).applyMatrix4(t.matrixWorld).multiplyScalar(.965),l=new b().fromBufferAttribute(r,o.getX((s+31)%o.count)).applyMatrix4(t.matrixWorld).multiplyScalar(.965),u=new b().fromBufferAttribute(r,o.getX(s+2)).applyMatrix4(t.matrixWorld).multiplyScalar(.94),d=c;for(let e=1;e<=6;e++){let t=e/6,r=c.clone().lerp(l,t);r.z+=Math.sin(t*Math.PI)*.008*Math.sin(n*2.4),i.push(...d,...r),d=r}let f=c.clone().lerp(l,.48);i.push(...f,...u),n%13==0&&a.push(c)}});let o=n(new Ae);o.setAttribute(`position`,new w(i,3)),t.add(new ne(o,n(new v({color:new U().setHSL(.49+e*.028,.22,.64),transparent:!1}))));let s=r({color:new U().setHSL(.18+e*.071,.23,.67),roughness:.37,metalness:.1,transmission:.32,thickness:.025,emissive:3758968,emissiveIntensity:.22}),c=new P(n(new h(1,1)),s,a.length),l=new oe;a.forEach((t,n)=>{let r=.013+bi(n+e*41)*.022;l.compose(t,new d,new b(r,r*1.8,r*.65)),c.setMatrixAt(n,l)}),n(c),t.add(c)}let ot=document.createElement(`canvas`);ot.width=ot.height=64;let st=ot.getContext(`2d`),ct=st.createImageData(64,64);for(let e=0;e<64;e++)for(let t=0;t<64;t++){let n=Math.exp(-((t-31.5)**2+(e-31.5)**2)/150);ct.data.set([255,255,255,Math.round(n*255)],(e*64+t)*4)}st.putImageData(ct,0,0);let lt=n(new ve(ot)),ut=[9096146,10865342,12950702,8960213,8632761,11836361,13744001,12816037,10471346],dt=new Map;Object.entries(Z).forEach(([e,t],r)=>{let i=e===`jelly`?[[0,.6,.08],[.2,.27,.08],[-.2,.2,.08]]:e===`algae`?[[.1,-.7,0],[.23,.3,0],[-.12,.85,0]]:[[-.8,.12,.05],[0,.04,.05],[.6,.04,.03]],a=n(new E({map:lt,color:ut[r],opacity:.2,transparent:!0,blending:2,depthWrite:!1,depthTest:!1,toneMapped:!1}));dt.set(e,a),i.forEach(e=>{let n=new c(a);n.position.set(...e),n.scale.set(.5,.7,1),t.add(n)})});let ft=ii(L),pt=ai({scanMap:a});for(let e of[o,l,_,y,S,D])ft.caustics(e);let mt=new ce(39,640/496,.1,80);mt.position.set(0,.15,7.5),mt.lookAt(0,-.15,0);let ht=new ce(34,448/360,.05,80),gt=n(new R(800,620,{depthBuffer:!0,samples:0})),_t=n(new R(520,416,{depthBuffer:!0,samples:0}));for(let e of[gt,_t])e.texture.colorSpace=Ie,e.texture.name=`MARINE volumetric specimen`;let vt=n(new R(800,620)),yt=n(new R(520,416));for(let e of[vt,yt])e.texture.colorSpace=Ie;let bt=n(new R(600,546,{depthBuffer:!0,samples:0})),xt=n(new R(600,546));bt.texture.colorSpace=xt.texture.colorSpace=Ie;let Ct=ci(z.texture),wt=Si(1200,1140);n(wt.texture);let Tt=new Map([[`screen.upper_right`,vt.texture],[`screen.right.01`,xt.texture],[`screen.right.02`,yt.texture],[`screen.right.03`,wt.texture]]),Et=0,Dt=!1,Ot=``,kt=0,At=0,jt=new Map;function Mt(){let t=e.getRenderTarget(),n=e.getViewport(new De),r=e.getScissor(new De),i=e.getScissorTest(),a=e.autoClear,o=new R(330,150),s=new Le(-1,1,1,-1,.05,40);o.texture.colorSpace=Ie;let c=L.background,l=L.fog,u=e.getClearColor(new U),d=e.getClearAlpha(),f=Object.values(Z).map(e=>({root:e,visible:e.visible,position:e.position.clone(),rotation:e.rotation.clone(),scale:e.scale.clone()}));try{L.background=null,L.fog=null,H.mesh.visible=!1,e.setClearColor(0,0),ft.setVisible(!1),W.visible=!1,J.visible=!1,e.autoClear=!0,e.setScissorTest(!1);for(let e of Object.values(Z))e.visible=!1;for(let[t,n]of Object.entries(Z)){n.visible=!0,n.position.set(0,0,0),n.rotation.set(.08,-.2,0),n.scale.setScalar(1),n.userData.animate(0,{}),n.updateMatrixWorld(!0);let r=new Oe().setFromObject(n),i=r.getSize(new b),a=r.getCenter(new b),c=Math.max(i.y*.6,i.x/2.2*.6,.4);s.left=-c*2.2,s.right=c*2.2,s.top=c,s.bottom=-c,s.position.copy(a).add(new b(0,0,9)),s.lookAt(a),s.updateProjectionMatrix(),e.setRenderTarget(o),e.clear(),e.render(L,s);let l=new Uint8Array(198e3);e.readRenderTargetPixels(o,0,0,330,150,l);let u=document.createElement(`canvas`);u.width=330,u.height=150;let d=u.getContext(`2d`),f=d.createImageData(330,150);for(let e=0;e<150;e++)f.data.set(l.subarray((149-e)*330*4,(150-e)*330*4),e*330*4);d.putImageData(f,0,0),jt.set(t,u),n.visible=!1}}finally{L.background=c,L.fog=l,H.mesh.visible=!0,e.setClearColor(u,d);for(let e of f)e.root.visible=e.visible,e.root.position.copy(e.position),e.root.rotation.copy(e.rotation),e.root.scale.copy(e.scale);ft.setVisible(!0),W.visible=!0,J.visible=!0,e.setRenderTarget(t),e.setViewport(n),e.setScissor(r),e.setScissorTest(i),e.autoClear=a,o.dispose()}}Mt();let Nt=new Ke;L.add(Nt);let Pt=[];for(let e=0;e<6;e++)for(let t=0;t<36;t++){let n=t/36*_i,r=(e%2?1:-1)*(5+e*.8),i=(e%3-1)*2.8,a=-10-e*2;for(let t=0;t<48;t++)for(let o=0;o<2;o++){let s=(t+o)/48,c=Math.sin(s*Math.PI)**1.6*(1.4+bi(e)*1.8),l=n+s*2.5;Pt.push(r+Math.cos(l)*c+Math.sin(s*8+e)*.25,i+(s-.5)*10,a+Math.sin(l)*c)}}let Ft=n(new Ae);Ft.setAttribute(`position`,new w(Pt,3)),Nt.add(new ne(Ft,n(new v({color:7706289,transparent:!0,opacity:.12,depthWrite:!1}))));let It=[];for(let e=0;e<18;e++){let t=Object.values(Z)[e%9],r=t.clone(!0);r.traverse(e=>{e.isLight&&(e.visible=!1),e.isInstancedMesh&&n(e)});let i=[],a=[];t.traverse(e=>i.push(e)),r.traverse(e=>a.push(e)),r.userData.limbPairs=a.slice(1).map((e,t)=>[e,i[t+1]]),L.add(r),It.push(r)}function Lt(e,t){let n=e.viewStates?.[`screen.right.03`]||{yaw:0,pitch:0,zoom:1},r=e.species+`:`+e.phase+JSON.stringify(n);if(!t&&r===Ot)return;Ot=r;let{ctx:i,canvas:a}=wt;i.setTransform(3,0,0,3,0,0);let o=i.createRadialGradient(110,100,0,170,150,330);o.addColorStop(0,`#123747`),o.addColorStop(.48,`#071e2c`),o.addColorStop(1,`#020a13`),i.fillStyle=o,i.fillRect(0,0,400,380);for(let e=0;e<1800;e++)i.fillStyle=`rgba(118,169,181,${.025+bi(e+907)*.08})`,i.fillRect(bi(e+301)*400,bi(e+531)*380,.4,.4);i.fillStyle=`#c5d5cb`,i.font=`11px "FS Pixel"`,i.fillText(`MARINE SPECIES / SP–02`,16,30),Object.entries(Ye).forEach(([t,r],a)=>{let o=16+a%3*123,s=78+Math.floor(a/3)*78,c=t===e.species;i.save(),i.beginPath(),i.rect(o+3,s+2,109,50),i.clip(),c?(i.translate(o+57.5,s+27),i.rotate(n.yaw),i.scale(n.zoom,n.zoom*Math.max(.35,Math.cos(n.pitch))),i.drawImage(jt.get(t),-54.5,-25,109,50)):i.drawImage(jt.get(t),o+3,s+2,109,50),i.restore(),c&&(i.strokeStyle=`#d4c9a5`,i.lineWidth=.8,i.strokeRect(o+.5,s+.5,114,69)),i.fillStyle=c?`#e0dfc6`:`#afc7c3`,i.font=`9px "FS Pixel"`,i.textAlign=`center`,i.fillText(r.name,o+57,s+65),i.textAlign=`left`}),i.fillStyle=`#91aaa9`,i.font=`8px "FS Pixel"`,i.fillText(`09 SPECIMENS`,16,350),wt.texture.needsUpdate=!0}function Rt(t){if(Dt)return;let n=t.inspecting,r=[`IDLE`,`LISTENING`,`SIGNAL_DETECTED`].includes(t.phase)&&!n;n&&(t={...t,phase:`ENCOUNTER`,progress:0});let i=performance.now();ye=t.touch||{active:!1};let a=t.viewStates?.[`screen.upper_right`]||t.view||{yaw:0,pitch:0,zoom:1},o=t.viewStates?.[`screen.right.02`]||{yaw:0,pitch:0,zoom:1},s=Number.isFinite(t.time)?t.time:0,c=vi(t.progress||0),l=Object.hasOwn(Z,t.species)?t.species:`jelly`,u=Z[l];J.rotation.y=Math.sin(s*.025)*.05;for(let[e,[n,r]]of Object.entries(Z).entries()){dt.get(n).opacity=.2+(n===l&&![`IDLE`,`LISTENING`,`COOLDOWN`].includes(t.phase)?.22:0),r.visible=!0,r.traverse(e=>{e.isPointLight&&(e.visible=n===l)}),(n===l||Et%3==e%3)&&r.userData.animate(s,n===l?t:{...t,phase:`LISTENING`,phaseTime:0,touch:{active:!1}});let i=fi(e,s);r.position.set(i.x,i.y,i.z),r.rotation.set(0,i.yaw,i.pitch),r.scale.setScalar(i.scale)}It.forEach((e,t)=>{for(let[t,n]of e.userData.limbPairs)t.position.copy(n.position),t.quaternion.copy(n.quaternion),t.scale.copy(n.scale);let n=fi(t+9,s);e.visible=!0,e.position.set(n.x,n.y,n.z),e.rotation.set(0,n.yaw,n.pitch),e.scale.setScalar(n.scale)}),t.phase;let d=xi[l],f=l===`algae`,p=new b(0,-.15,-5);mt.position.set(0,.3,12.5/a.zoom).applyAxisAngle(new b(0,1,0),a.yaw).applyAxisAngle(new b(1,0,0),a.pitch).add(p),mt.lookAt(p);let m=-11,h=Math.sin(s*.16)*(f?.025:.8),g=Math.sin(s*.32)*(f?.015:.18),_=d.scale;if(t.phase===`SIGNAL_DETECTED`&&(m=-11),t.phase===`APPROACH`){let e=yi(c);m=-11+e*11,h=(1-e)*d.approachX+Math.sin(s*.6)*(f?.015:.15),g+=(1-e)*d.approachY}if([`ENCOUNTER`,`ECHO`].includes(t.phase)&&(m=0,h=Math.sin(s*.46)*(f?.015:.12),g+=l===`jelly`?.45:f?-.12:0),t.phase===`ESCAPE`){let e=yi(c);m=-e*d.escapeZ,h=e*d.escapeX,g=(l===`jelly`?.45:0)+e*d.escapeY,_=d.scale*(f?1:1-e*.12)}t.phase===`COOLDOWN`&&(m=f?-2:-32),f&&(h=0,g=-2.35),u.position.set(h,g,m),u.scale.setScalar(_);let v=Math.sin(s*(l===`whale`?.16:.35))*(f?.012:l===`whale`?.035:.16);u.rotation.set(d.pitch,d.yaw+v,f?0:Math.sin(s*.42)*(l===`whale`?.012:.06)),t.phase===`ESCAPE`&&!f&&(u.rotation.y+=c*d.turn,u.rotation.z+=c*d.roll);let y=fi(Object.keys(Z).indexOf(l),s);if(r)u.position.set(y.x,y.y,y.z),u.scale.setScalar(y.scale),u.rotation.set(0,y.yaw,y.pitch);else if(t.phase===`COOLDOWN`){let e=yi(c);u.position.set(y.x*e,y.y*e,-32*(1-e)+y.z*e),u.scale.setScalar(y.scale)}else if(t.phase===`APPROACH`){let e=fi(Object.keys(Z).indexOf(l),s-t.phaseTime),n=1-(1-c)**3;u.position.set(e.x*(1-n)+h*n,e.y*(1-n)+g*n,e.z*(1-n)),u.scale.setScalar(e.scale*(1-n)+d.scale*n)}if(!f&&l!==`jelly`&&t.phase===`ESCAPE`&&u.rotation.set(0,Math.atan2(-d.escapeZ,-d.escapeX),-Math.atan2(d.escapeY,Math.hypot(d.escapeX,d.escapeZ))),!f&&l!==`jelly`&&t.phase===`APPROACH`){let e=fi(Object.keys(Z).indexOf(l),s-t.phaseTime),n=yi(c),r=Math.atan2(-e.z,e.x);u.rotation.set(0,r*(1-yi((n-.8)/.2))+d.yaw*yi((n-.8)/.2),0)}f&&(u.position.set(y.x,y.y,y.z),u.scale.setScalar(y.scale),u.rotation.set(0,0,0));let x={...t,species:l,escapeDirection:[d.escapeX,d.escapeY,-d.escapeZ]};ft.update(x);let S=e.getRenderTarget(),C=e.getActiveCubeFace(),w=e.getActiveMipmapLevel(),T=e.autoClear,E=e.getClearColor(new U),D=e.getClearAlpha(),O=u.position.clone(),k=u.rotation.clone(),A=u.scale.clone();try{e.autoClear=!0,e.setRenderTarget(gt),e.clear(),e.render(L,mt),pt.render(e,gt,vt,s),Nt.visible=!1,It.forEach(e=>e.visible=!1);for(let e of Object.values(Z))e.visible=e===u;u.position.set(0,0,0),u.scale.setScalar(1),u.rotation.set(.1,-.16+Math.sin(s*.18)*.16,l===`jelly`?.08:-.12),ft.setVisible(!1),W.visible=!1,ht.position.set(...d.detail);let n=new b(...d.focus),r=ht.position.clone().sub(n).applyAxisAngle(new b(0,1,0),o.yaw).applyAxisAngle(new b(1,0,0),o.pitch).divideScalar(o.zoom);ht.position.copy(n).add(r),ht.lookAt(...d.focus),e.setRenderTarget(_t),e.clear(),e.render(L,ht),pt.render(e,_t,yt,s),Ct.update({...t,view:t.viewStates?.[`screen.right.01`]||{zoom:1}}),e.setRenderTarget(bt),e.clear(),e.render(Ct.scene,Ct.camera),pt.render(e,bt,xt,s)}finally{Nt.visible=!0,It.forEach(e=>e.visible=!0);for(let e of Object.values(Z))e.visible=!0;u.position.copy(O),u.rotation.copy(k),u.scale.copy(A),ft.update(x),ft.setVisible(!0),W.visible=!0,e.setRenderTarget(S,C,w),e.autoClear=T,e.setClearColor(E,D)}Lt({...t,species:l},Et===0),Et++,kt=performance.now()-i,At+=kt}return{textures:Tt,render:Rt,diagnostics:()=>({frames:Et,disposed:Dt,population:27,roamingSpecies:Object.keys(Z),archiveSpecimens:[...jt.keys()],species:Object.keys(Z),renderTargets:6,resonator:Ct.diagnostics(),water:ft.diagnostics(),sharedRenderer:!0,renderMs:kt,averageRenderMs:Et?At/Et:0,channels:[...Tt].map(([e,t])=>({id:e,type:t.isRenderTargetTexture?`WebGLRenderTarget`:`CanvasTexture`,width:t.image?.width,height:t.image?.height}))}),dispose(){if(!Dt){Dt=!0;for(let e of t)e.dispose();for(let e of jt.values())e.width=e.height=0;jt.clear(),H.dispose(),ft.dispose(),pt.dispose(),Ct.dispose(),z.dispose(),L.clear();for(let e of[wt,pe])e.canvas.width=e.canvas.height=0}}}}var wi={IDLE:`Idle / preview`,LISTENING:`Listening`,SIGNAL_DETECTED:`Signal detected`,APPROACH:`Approaching`,ENCOUNTER:`Encounter`,ECHO:`Non-verbal echo`,ESCAPE:`Escaping`,COOLDOWN:`Cooldown`},Ti=[`01 / ENCOUNTER`,`02 / PRESSURE`,`03 / TISSUE`,`04 / ARCHIVE`];function Ei({marine:e,audio:t}){let n=document.createElement(`aside`);n.id=`marine-species-panel`,n.hidden=!0,n.setAttribute(`aria-label`,`MARINE SPECIES Marine echo terminal`),n.innerHTML=`
 <header class="air-heading"><div><small>LIVING STUDY / SP–02</small><h2>MARINE SPECIES</h2></div><span class="air-indicator" aria-hidden="true"></span></header>
 <div class="marine-channel"><span>FOUR LINKED VIEWS</span><b data-channel></b></div>
 <a class="air-open-focus" href="./marine.html">OPEN FOUR VIEWS <span aria-hidden="true">↗</span></a>

 <div class="marine-state"><i aria-hidden="true"></i><strong data-phase role="status"></strong><span data-species></span></div>
 <canvas width="448" height="104" data-wave aria-label="Live audio waveform"></canvas>
 <label class="marine-volume">Level <meter min="0" max="0.15" value="0" aria-label="Live microphone level"></meter><output data-volume>0%</output></label>
 <div class="marine-pad-heading"><span>VIEW FIELD</span><span>ORBIT / CONTACT</span></div><div data-marine-pad tabindex="0" role="group" aria-label="Marine orbit and contact touchpad"><span class="instrument-pad-target" aria-hidden="true"></span></div><p class="instrument-pad-help">DRAG TO ORBIT · SHIFT + DRAG TO TOUCH<br>SCROLL OR PINCH TO ZOOM</p><label class="marine-range">ZOOM<input data-zoom type="range" min="0.55" max="2.2" step="0.01" value="1" aria-label="Marine zoom"></label><button data-reset-view type="button">RESET VIEW</button>
 <label class="marine-range">TRIGGER LEVEL <output data-sensitivity></output><input type="range" min="0.005" max="0.12" step="0.001" value="0.018" aria-label="Sound trigger threshold; lower is more sensitive"></label>
 <label class="marine-range">HOLD TIME <output data-hold></output><input type="range" min="0.04" max="1.5" step="0.01" value="0.06" aria-label="Call duration"></label>
 <div class="marine-actions"><button type="button" data-mic>ENABLE MIC</button><button type="button" data-input-done>DONE / END INPUT</button><button type="button" data-stop>STOP</button></div>
 <label class="marine-range">SPECIMEN<select data-visitor aria-label="Marine specimen for simulated calls"><option value="auto">Random specimen</option>${Object.entries(Ye).map(([e,t])=>`<option value="${e}">${t.name}</option>`).join(``)}</select></label>
 <button type="button" data-call>SIMULATE CALL <span aria-hidden="true">↗</span></button>
 <p class="marine-permission" data-permission role="status"></p>
 <p class="marine-privacy">LOCAL LEVEL ANALYSIS ONLY. NO RECORDING OR UPLOADS. LEAVING RELEASES THE MICROPHONE.</p>
 <span data-count hidden>00</span>`,document.body.append(n),n.querySelectorAll(`output`).forEach(e=>e.setAttribute(`aria-live`,`off`));let r=e=>n.querySelector(e),i=r(`[data-wave]`).getContext(`2d`),a=r(`[data-mic]`),o=r(`[data-stop]`),s=r(`[data-call]`),c=r(`input[aria-label^="Sound"]`),l=r(`input[aria-label="Call duration"]`),u=r(`[data-phase]`),d=r(`[data-species]`),f=r(`[data-permission]`),p=Xe(r(`[data-marine-pad]`),{orbit:e.orbit,zoom:e.zoom,contact:e.contact,reset:()=>e.setView({yaw:0,pitch:0,zoom:1})}),m=new AbortController,h=0,g=``,_=``,v=-1/0,y=(e,t,n)=>e.addEventListener(t,n,{signal:m.signal});for(let e of[`pointerdown`,`pointermove`,`pointerup`,`pointercancel`,`click`,`dblclick`,`wheel`,`keydown`,`keyup`])y(n,e,e=>{e.key!==`Escape`&&e.stopPropagation()});function b(){h++,e.stop(),t.stop(),E(!0)}async function x(){h++;let n=![`IDLE`,`LISTENING`].includes(e.state.phase);e.setRemoteLevel(0),n?(t.finishInput(),await t.unlock()):(t.stop(),e.stop()),E(!0)}async function S(){let r=++h,i=t.start();E(!0),await i&&r===h&&!n.hidden&&e.start(),E(!0)}async function C(n){if(![`IDLE`,`LISTENING`].includes(e.state.phase))return!1;let i=++h,a=t.unlock(),o=e.call(n||r(`[data-visitor]`).value);return E(!0),await a,i===h&&E(!0),o}function w(t){b(),e.inspect(t),r(`[data-visitor]`).value=t,E(!0)}y(r(`[data-zoom]`),`input`,t=>e.setView({zoom:Number(t.target.value)})),y(r(`[data-reset-view]`),`click`,()=>e.setView({yaw:0,pitch:0,zoom:1})),y(a,`click`,()=>{t.status===`listening`||t.status===`requesting`?b():S()}),y(r(`[data-visitor]`),`change`,()=>{let e=r(`[data-visitor]`).value;e!==`auto`&&w(e)}),y(r(`[data-input-done]`),`click`,()=>void x()),y(o,`click`,b),y(s,`click`,()=>void C()),y(c,`input`,()=>{e.setParameters({threshold:Number(c.value)}),E(!0)}),y(l,`input`,()=>{e.setParameters({hold:Number(l.value)}),E(!0)});function T(t){let i=Je.indexOf(t),a=i>=0;!a&&!n.hidden&&b(),n.hidden=!a,document.body.classList.toggle(`marine-species-open`,a),a&&(e.selectScreen(t),r(`[data-channel]`).textContent=Ti[i],E(!0))}function E(c=!1){if(n.hidden&&!c)return;let l=performance.now();if(!c&&l-v<70)return;v=l;let p=e.state,m=![`IDLE`,`LISTENING`].includes(p.phase),h=t.status===`listening`,y=t.status===`requesting`;g!==p.phase+t.status+p.inspecting&&(u.textContent=p.inspecting?`Inspecting`:p.phase===`LISTENING`&&!h?`Ready / simulate call`:wi[p.phase],g=p.phase+t.status+p.inspecting),document.activeElement!==r(`[data-zoom]`)&&(r(`[data-zoom]`).value=p.view.zoom),d.textContent=Ye[p.species]?.name||p.species,n.dataset.phase=p.phase;let b=p.selectedScreen===`screen.right.01`;r(`[data-marine-pad]`).classList.toggle(`rotation-locked`,b),r(`.instrument-pad-help`).innerHTML=b?`FIXED ORIENTATION · SOUND RESPONSE<br>SCROLL OR PINCH TO ZOOM`:`DRAG TO ORBIT · SHIFT + DRAG TO TOUCH<br>SCROLL OR PINCH TO ZOOM`,_!==t.message&&(f.textContent=t.message,_=t.message),a.textContent=y?`CANCEL REQUEST`:h?`STOP MIC`:`ENABLE MIC`,a.disabled=m&&!h&&!y,r(`[data-input-done]`).disabled=!h&&!y,s.disabled=m||y,o.disabled=!p.inspecting&&p.phase===`IDLE`&&!h&&!y,r(`[data-count]`).textContent=String(p.encounterCount).padStart(2,`0`),r(`[data-volume]`).textContent=Math.round(Math.min(1,p.level/.15)*100)+`%`,r(`meter`).value=p.level,r(`[data-sensitivity]`).textContent=p.threshold.toFixed(3)+` `,r(`[data-hold]`).textContent=p.hold.toFixed(2)+` s`,i.fillStyle=`#122a33`,i.fillRect(0,0,448,104),i.lineWidth=1,i.strokeStyle=`#c6bec044`,i.beginPath(),i.moveTo(0,52),i.lineTo(448,52),i.stroke(),i.strokeStyle=m?`#d3b9c5`:`#b8d9d8`,i.beginPath();let x=t.waveform;for(let e=0;e<448;e++){let t=52+(h&&x[Math.floor(e/448*x.length)]||0)*160;e?i.lineTo(e,t):i.moveTo(e,t)}i.stroke(),i.fillStyle=`#9ab8bb`,i.font=`10px "FS Pixel"`,i.fillText(h?m?`INPUT / DETECTION PAUSED`:`INPUT / LOCAL ONLY`:`INPUT / OFF`,10,17)}return{element:n,show:T,update:E,stop:b,finishInput:x,simulate:C,inspect:w,startMicrophone:S,dispose(){b(),p(),m.abort(),n.remove(),document.body.classList.remove(`marine-species-open`)}}}function Di({message:e,marine:t,panel:n,onTelemetry:r,onChannel:i}){if(e?.targetSession&&e.targetSession!==t.sessionId)return!1;if(e?.type===`marineSelect`)return t.selectScreen(e.id);if(e?.type===`marineView`)return t.setView(e.patch);if(e?.type===`marineOrbit`)return t.orbit(e.dx,e.dy);if(e?.type===`marineZoom`)return t.zoom(e.factor);if(e?.type===`marineContact`)return t.contact(e.input);if(e?.type===`marineListen`)return t.start(),!0;if(e?.type===`marineAudioLevel`)return t.setRemoteLevel(e.level);if(e?.type===`marineStateRequest`)return r(),!0;if(e?.type===`marineInspect`){if(!Object.hasOwn(Ye,e.species))throw TypeError(`Unknown marine species.`);return n.inspect(e.species),!0}if(e?.type===`marineCall`){if(e.species!==`auto`&&!Object.hasOwn(Ye,e.species))throw TypeError(`Unknown marine species.`);return n.simulate(e.species)}return e?.type===`marineInputDone`?(n.finishInput(),!0):e?.type===`marineStop`?(n.stop(),!0):e?.type===`marineParameters`?(t.setParameters(e.patch),!0):e?.type===`marineChannel`&&typeof e.enabled==`boolean`&&i(e.id,e.enabled)}function Oi(e,t,n=`installation`){return{type:`marineTelemetry`,source:n,sessionId:e.sessionId,startedAt:e.startedAt,state:e.snapshot(),channels:Object.fromEntries(t)}}function ki(e,t){if(!Number.isFinite(e)||!Number.isFinite(t))return null;let n=e*400,r=(1-t)*380;if(n<16||n>=385||r<78||r>=312)return null;let i=Math.floor((n-16)/123),a=Math.floor((r-78)/78);return(n-16)%123>115||(r-78)%78>70?null:Object.keys(Ye)[a*3+i]||null}export{Ci as a,St as c,Ei as i,$r as l,ki as n,ni as o,Oi as r,ei as s,Di as t};