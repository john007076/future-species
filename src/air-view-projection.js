// Rotate model coordinates before rasterization; never rotate a rendered screen or its sky.
export function orientAirPoint(point,view){
 if(!view)return point;
 const cy=Math.cos(view.yaw),sy=Math.sin(view.yaw),cp=Math.cos(view.pitch),sp=Math.sin(view.pitch),zoom=view.zoom;
 const x=point[0]*cy+point[2]*sy,z=point[2]*cy-point[0]*sy,y=point[1];
 point[0]=x*zoom;point[1]=(y*cp-z*sp)*zoom;point[2]=(y*sp+z*cp)*zoom;return point;
}
