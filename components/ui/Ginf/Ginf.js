// filepath: /path/to/Ginf.js\
import { Text } from "react-native";
import React from "react";
import StarIcon from "./icons/StarIcon";
import StarIconFill from "./icons/StarIconFill";
import CirclePlusIcon from "./icons/CirclePlus";
import HomeIcon from "./icons/HomeIcon.js";
import AccountIcon from "./icons/AccountIcon.js";
import EventIcon from "./icons/EventIcon.js";
import BookIcon from "./icons/BookIcon.js";
import VerifIcon from "./icons/VerifIcon.js";
import ShareIcon from "./icons/ShareIcon.js";
import XIcon from "./icons/XIcon.js";
import SearchIcon from "./icons/SearchIcon.js";
import ArrowBack from "./icons/ArrowBack.js";
import Pointer from "./icons/Pointer.js";
import ArrowRight from "./icons/ArrowRight.js";
import ArrowTop from "./icons/ArrowTop.js";
import CircleIcon from "./icons/CircleIcon.js";
import LogoTWS from "./icons/LogoTWS.js";
import MessageIcon from "./icons/MessageIcon.js";
import Check from "./icons/Check"
import Eye from "./icons/Eye";
import EyeClosed from "./icons/EyeClosed";
import DoubleCheck from "./icons/DoubleCheck";
import UnevenCircle from "./icons/UnevenCircle"
import BookStack from "./icons/BookStack"
import DoubleCircle from "./icons/DoubleCircle"

const iconMap = {
	star: StarIcon,
	starFill: StarIconFill,
	circlePlus: CirclePlusIcon,
	home: HomeIcon,
	account: AccountIcon,
    event: EventIcon,
    book: BookIcon,
    verif: VerifIcon,
    share: ShareIcon,
	x: XIcon,
	search: SearchIcon,
	arrowBack: ArrowBack,
	pointer: Pointer,
	arrowRight: ArrowRight,
	arrowTop: ArrowTop,
	circle: CircleIcon,
	logoTws: LogoTWS,
	message: MessageIcon,
	check: Check,
	eye: Eye,
	eyeClosed: EyeClosed,
	doubleCheck: DoubleCheck,
	unevenCircle: UnevenCircle,
	bookStack: BookStack,
	doubleCircle: DoubleCircle
	
	// Dodaj inne ikony tutaj
};

const Ginf = ({ name, size=20, color="white" }) => {
	const IconComponent = iconMap[name];
	if (!IconComponent) {
		return (
			<Text>
				{`Ikona ${name} nie znaleziona`}
			</Text>
		);
	}
	return <IconComponent width={size} height={size} fill={color} />;
};

export default Ginf;
