import BottomSheet, {
	BottomSheetView,
	BottomSheetBackdrop,
	BottomSheetModal,
	BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, { useCallback, forwardRef } from "react";
const CustomBottomSheet = forwardRef((props, ref) => {
	const { children, scrollView = true, hideBackdrop = false, ...prps } = props;
	const pressBehavior = props.pressBehavior ? props.pressBehavior : "close";
	const renderBackdrop = useCallback(
        (props) =>
            !hideBackdrop ? (
                <BottomSheetBackdrop
                    {...props}
                    appearsOnIndex={0}
                    disappearsOnIndex={-1}
                    pressBehavior={pressBehavior}
					opacity={0.1}
                />
            ) : null,
        [hideBackdrop]
    );
	return (
		<BottomSheetModal
			ref={ref}
			index={0}
			enableDynamicSizing={false}
			enablePanDownToClose={true}
			handleIndicatorStyle={{ backgroundColor: "white" }}
			backgroundStyle={{
				backgroundColor: "#252525",
				borderTopLeftRadius: 50,
				borderTopRightRadius: 50,
				flex: 1,
			}}
			backdropComponent={renderBackdrop}
			keyboardBehavior="fillParent"
			{...prps}>
			{scrollView ? (
				<BottomSheetScrollView
					nestedScrollEnabled>
					{children}
				</BottomSheetScrollView>
			) : children}
		</BottomSheetModal>
	);
});

export default CustomBottomSheet;
