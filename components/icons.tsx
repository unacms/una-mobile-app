import React from "react";
import Svg, {
  G,
  Path
} from "react-native-svg";

export type IconProps = {
  size?: number;
  color?: string;
  style?: any;
};

/* ===================== ICON TEMPLATE ===================== */

function StrokeIcon({
  size = 24,
  color = "#000",
  style,
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <G fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        {children}
      </G>
    </Svg>
  );
}

/* ===================== ICONS ===================== */

export const Home = (p: IconProps) => (
  <StrokeIcon {...p}>
    <Path d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12" />
    <Path d="M4.5 9.75V19.875A1.125 1.125 0 005.625 21H9.75v-4.875A1.125 1.125 0 0110.875 15h2.25A1.125 1.125 0 0114.25 16.125V21h4.125A1.125 1.125 0 0019.5 19.875V9.75" />
  </StrokeIcon>
);

export const Apps = (p: IconProps) => (
  <StrokeIcon {...p}>
    <Path d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25A2.25 2.25 0 018.25 10.5H6A2.25 2.25 0 013.75 8.25V6z" />
    <Path d="M3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25z" />
    <Path d="M13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6z" />
    <Path d="M13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
  </StrokeIcon>
);

export const Bell = (p: IconProps) => (
  <StrokeIcon {...p}>
      <G fill="none" stroke-width="1.5" stroke={p.color} class="w-6 h-6">
          <Path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
      </G>
  </StrokeIcon>
);

export const Plus = (p: IconProps) => (
  <StrokeIcon {...p}>
    <Path d="M12 9v6M15 12H9" />
    <Path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </StrokeIcon>
);

export const Chat = (p: IconProps) => (
  <StrokeIcon {...p}>
      <G fill="none" stroke-width="1.5" stroke={p.color} class="w-6 h-6">
          <Path stroke-linecap="round" stroke-linejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </G>
  </StrokeIcon>
);

export const User = (p: IconProps) => (
  <StrokeIcon {...p}>
    <Path d="M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
    <Path d="M6.018 18.725A7.488 7.488 0 0112 15.75a7.488 7.488 0 015.982 2.975" />
  </StrokeIcon>
);

export const Bars = (p: IconProps) => (
  <StrokeIcon {...p}>
    <Path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </StrokeIcon>
);

export const Search = (p: IconProps) => (
  <StrokeIcon {...p}>
    <Path d="M21 21l-5.197-5.197" />
    <Path d="M15.803 15.803A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </StrokeIcon>
);

export const Back = (p: IconProps) => (
  <StrokeIcon {...p}>
    <Path d="M10.5 19.5L3 12l7.5-7.5M3 12h18" />
  </StrokeIcon>
);

export const Cross = (p: IconProps) => (
  <StrokeIcon {...p}>
    <Path d="M6 18L18 6M6 6l12 12" />
  </StrokeIcon>
);

export const In = (p: IconProps) => (
  <StrokeIcon {...p}>
      <G fill="none" strokeWidth={1.5} stroke={p.color} className="w-6 h-6">
          <Path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
      </G>
  </StrokeIcon>
);

export const PlusCircle = Plus;

export const Question = (p: IconProps) => (
  <StrokeIcon {...p}>
    <Path d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75" />
    <Path d="M12 17.25h.008" />
    <Path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </StrokeIcon>
);
