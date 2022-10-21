
import * as React from 'react';
import { Icon } from 'native-base';
import Svg, {
  Defs,
  ClipPath,
  Rect,
  G,
  LinearGradient,
  Stop,
  Path,
  RadialGradient,
} from "react-native-svg";

const Logo = (o) => (
  <Icon size={o.size} viewBox="0 0 3264 1024" style={o.style}>
    <Path
      d="M840.961 925.025c-10.369 8.269-10.635 24.061.983 30.457 33.884 18.652 80.294 30.953 126.4 35.03 11.27.996 20.659-8.109 20.751-19.423.18-21.96.59-48.97 1.047-79.089.425-27.979.891-58.641 1.25-90.429.182-16.128-23.798-22.051-32.398-8.407-31.718 50.318-71.697 94.907-118.033 131.861Z"
      fill="url(#a)"
    />
    <Path
      d="M181.2 100.447c10.709-8.618 10.49-25.144-1.743-31.413-36.658-18.789-83.834-31.207-126.784-35.415C41.4 32.514 32 41.623 32 52.949v170.23c0 16.097 24.036 21.932 32.6 8.302 31.362-49.915 70.847-94.211 116.6-131.034Z"
      fill="url(#b)"
    />
    <Path
      d="M512 992c265.097 0 480-214.903 480-480 0-135.453-56.107-257.802-146.347-345.074C827.875 149.733 800 163.288 800 188.019V512c0 159.058-128.942 288-288 288-76.388 0-145.831-29.74-197.38-78.273-14.417-13.573-42.62-4.071-42.62 15.73v167.256c0 14.279 7.552 27.593 20.241 34.139C358.087 972.82 432.804 992 512 992Z"
      fill="url(#c)"
    />
    <Path
      d="M709.38 302.273c14.417 13.573 42.62 4.071 42.62-15.73V119.287c0-14.279-7.552-27.593-20.242-34.139C665.913 51.18 591.196 32 512 32 246.903 32 32 246.903 32 512c0 135.453 56.106 257.802 146.347 345.074C196.125 874.267 224 860.712 224 835.981V512c0-159.058 128.942-288 288-288 76.388 0 145.831 29.74 197.38 78.273Z"
      fill="url(#d)"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1706.33 771.031c-58.89 34.212-111.66 34.212-140.16 34.212-.12 0-.25 0-.38-.003-.12.003-.25.003-.38.003-28.49 0-81.27 0-140.15-34.212-25.88-13.977-49.97-32.239-72.28-54.786-59.32-58.71-88.98-129.783-88.98-213.216V222.21c0-10.274 7.81-18.787 18.08-18.416 26.53.959 75.45 8.453 99.23 48.534 2.97 4.995 4.12 10.828 4.12 16.636v234.065c0 55.242 17.6 92.702 52.83 127.932 35.13 35.137 77.64 52.75 127.53 52.839 49.89-.089 92.4-17.702 127.54-52.839 35.22-35.23 47-70.882 52.83-127.932 5.26-53.878 5.69-126.97 1.11-221.449-.42-8.485 9.23-13.513 15.7-8.008 118.87 101.119 104.61 229.457 104.61 229.457 0 83.433-29.66 154.506-88.98 213.216-22.31 22.547-46.4 40.809-72.27 54.786Z"
      fill="url(#e)"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2123.11 242.93c58.88-34.211 111.66-34.211 140.15-34.211h.76c28.5 0 81.27 0 140.16 34.211 25.87 13.978 49.96 32.239 72.27 54.784 59.33 58.711 88.99 129.784 88.99 213.216v280.82c0 10.273-7.81 18.786-18.08 18.415-26.54-.959-75.46-8.451-99.24-48.532-2.96-4.995-4.11-10.829-4.11-16.636V510.93c0-59.212-17.61-92.702-52.83-127.931-35.14-35.137-77.65-52.75-127.54-52.839-49.89.089-92.4 17.702-127.53 52.839-35.22 35.229-52.83 67.846-52.83 127.931v222.878c0 8.242-9.4 12.833-15.7 7.52-120.07-101.261-105.73-230.398-105.73-230.398 0-83.432 29.66-154.505 88.99-213.216 22.3-22.545 46.39-40.806 72.27-54.784Z"
      fill="url(#f)"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3263.25 501.331c.4 3.024.63 6.222.63 9.601v280.819c0 10.273-7.81 18.786-18.08 18.415-28.18-1.019-81.6-9.406-103.35-56.354.03-.681.06-1.361.11-2.041-50.37 37.764-112.94 60.137-180.74 60.137-166.54 0-301.54-135.029-301.54-301.596 0-166.565 135-301.593 301.54-301.593 163.54 0 296.69 130.201 301.43 292.612ZM2961.82 689.95c99.2 0 179.63-80.425 179.63-179.638 0-99.211-80.43-179.637-179.63-179.637-99.17 0-179.6 80.426-179.6 179.637 0 99.213 80.43 179.638 179.6 179.638Z"
      fill="url(#g)"
    />
    <Defs>
      <RadialGradient
        id="a"
        cx={0}
        cy={0}
        r={1}
        gradientUnits="userSpaceOnUse"
        gradientTransform="matrix(0 260 -165.059 0 992 732)"
      >
        <Stop stopColor="#FB923C" />
        <Stop offset={1} stopColor="#EF4444" />
      </RadialGradient>
      <RadialGradient
        id="b"
        cx={0}
        cy={0}
        r={1}
        gradientUnits="userSpaceOnUse"
        gradientTransform="matrix(0 -260 171.858 0 32 291.999)"
      >
        <Stop stopColor="#0EA5E9" />
        <Stop offset={1} stopColor="#38BDF8" />
      </RadialGradient>
      <RadialGradient
        id="c"
        cx={0}
        cy={0}
        r={1}
        gradientUnits="userSpaceOnUse"
        gradientTransform="matrix(0 864 -719.971 0 632 128)"
      >
        <Stop stopColor="#38BDF8" />
        <Stop offset={1} stopColor="#0284C7" />
      </RadialGradient>
      <RadialGradient
        id="d"
        cx={0}
        cy={0}
        r={1}
        gradientUnits="userSpaceOnUse"
        gradientTransform="matrix(0 864 -719.971 0 525.5 32)"
      >
        <Stop stopColor="#34D399" />
        <Stop offset={1} stopColor="#059669" />
      </RadialGradient>
      <LinearGradient
        id="e"
        x1={1566.06}
        y1={203.675}
        x2={1566.06}
        y2={805.243}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#F59E0B" />
        <Stop offset={1} stopColor="#F97316" />
      </LinearGradient>
      <LinearGradient
        id="f"
        x1={2263.38}
        y1={208.719}
        x2={2263.38}
        y2={810.284}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#F59E0B" />
        <Stop offset={1} stopColor="#F97316" />
      </LinearGradient>
      <LinearGradient
        id="g"
        x1={2962.08}
        y1={208.719}
        x2={2962.08}
        y2={811.908}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#F59E0B" />
        <Stop offset={1} stopColor="#F97316" />
      </LinearGradient>
    </Defs>
  </Icon>
);

function Home(o) {
    return (
        <Icon size={o.size} viewBox="0 0 24 24" style={o.style}>
            <G fill="none" stroke-width="1.5" stroke={o.color} class="w-6 h-6">
                <Path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </G>
        </Icon>
    );
}

function Apps(o) {
    return (
        <Icon size={o.size} viewBox="0 0 24 24" style={o.style}>
            <G fill="none" stroke-width="1.5" stroke={o.color} class="w-6 h-6">
                <Path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </G>
        </Icon>
    );
}

function Bell(o) {
    return (
        <Icon size={o.size} viewBox="0 0 24 24" style={o.style}>
            <G fill="none" stroke-width="1.5" stroke={o.color} class="w-6 h-6">
                <Path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </G>
        </Icon>
    );
}

function Plus(o) {
    return (
        <Icon size={o.size} viewBox="0 0 24 24" style={o.style}>
            <G fill="none" stroke-width="1.5" stroke={o.color} class="w-6 h-6">
                <Path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </G>
        </Icon>
    );
}

function Chat(o) {
    return (
        <Icon size={o.size} viewBox="0 0 24 24" style={o.style}>
            <G fill="none" stroke-width="1.5" stroke={o.color} class="w-6 h-6">
                <Path stroke-linecap="round" stroke-linejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </G>
        </Icon>
    );
}

function User(o) {
    return (
        <Icon size={o.size} viewBox="0 0 24 24" style={o.style}>
            <G fill="none" stroke-width="1.5" stroke={o.color} class="w-6 h-6">
                <Path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
            </G>
        </Icon>
    );
}

function Bars(o) {
    return (
        <Icon size={o.size} viewBox="0 0 24 24" style={o.style}>
            <G fill="none" strokeWidth={1.5} stroke={o.color} className="w-6 h-6">
                <Path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </G>
        </Icon>
    );
}

function Search(o) {
    return (
        <Icon size={o.size} viewBox="0 0 24 24" style={o.style}>
            <G fill="none" stroke-width="1.5" stroke={o.color} class="w-6 h-6">
                <Path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </G>
        </Icon>
    );
}

function Back(o) {
    return (
        <Icon size={o.size} viewBox="0 0 24 24" style={o.style}>
            <G fill="none" stroke-width="1.5" stroke={o.color} class="w-6 h-6">
                <Path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </G>
        </Icon>
    );
}

function Cross(o) {
    return (
        <Icon size={o.size} viewBox="0 0 24 24" style={o.style}>
            <G fill="none" stroke-width="1.5" stroke={o.color} class="w-6 h-6">  
                <Path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </G>
        </Icon>
    );
}

function In(o) {
    return (
        <Icon size={o.size} viewBox="0 0 24 24" style={o.style}>
            <G fill="none" strokeWidth={1.5} stroke={o.color} className="w-6 h-6">
                <Path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </G>
        </Icon>
    );
}

function PlusCircle(o) {
    return (
        <Icon size={o.size} viewBox="0 0 24 24" style={o.style}>
            <G fill="none" strokeWidth={1.5} stroke={o.color} className="w-6 h-6">
                <Path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </G>
        </Icon>
    );
}

function Question(o) {
    return (
        <Icon size={o.size} viewBox="0 0 24 24" style={o.style}>
            <G fill="none" strokeWidth={1.5} stroke={o.color} className="w-6 h-6">
                <Path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </G>
        </Icon>
    );
}

export {Logo, Home, Apps, Bell, Plus, Chat, User, Bars, Search, Back, Cross, In, PlusCircle, Question};
