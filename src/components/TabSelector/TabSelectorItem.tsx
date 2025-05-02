import React, { useMemo, useState } from 'react';
// eslint-disable-next-line no-restricted-imports
import { Animated } from 'react-native';
import PressableWithFeedback from '@components/Pressable/PressableWithFeedback';
import Tooltip from '@components/Tooltip';
import useThemeStyles from '@hooks/useThemeStyles';
import CONST from '@src/CONST';
import type IconAsset from '@src/types/utils/IconAsset';
import TabIcon from './TabIcon';
import TabLabel from './TabLabel';
import { useProductTrainingContext } from '@components/ProductTrainingContext';
import { getIsUserSubmittedExpenseOrScannedReceipt } from '@libs/OptionsListUtils';
import Permissions from '@libs/Permissions';
import { isUserInvitedToWorkspace } from '@libs/PolicyUtils';
import { dismissProductTraining } from '@libs/actions/Welcome';
import EducationalTooltip from '@components/Tooltip/EducationalTooltip';
import ONYXKEYS from '@src/ONYXKEYS';
import useOnyx from '@hooks/useOnyx';


const AnimatedPressableWithFeedback = Animated.createAnimatedComponent(PressableWithFeedback);

type TabSelectorItemProps = {
    /** Function to call when onPress */
    onPress?: () => void;

    /** Icon to display on tab */
    icon?: IconAsset;

    /** Title of the tab */
    title?: string;

    /** Animated background color value for the tab button */
    backgroundColor?: string | Animated.AnimatedInterpolation<string>;

    /** Animated opacity value while the tab is in inactive state */
    inactiveOpacity?: number | Animated.AnimatedInterpolation<number>;

    /** Animated opacity value while the tab is in active state */
    activeOpacity?: number | Animated.AnimatedInterpolation<number>;

    /** Whether this tab is active */
    isActive?: boolean;

    /** Whether to show the label when the tab is inactive */
    shouldShowLabelWhenInactive?: boolean;

    /** Test identifier used to find elements in unit and e2e tests */
    testID?: string;
};

function TabSelectorItem({
    icon,
    title = '',
    onPress = () => {},
    backgroundColor = '',
    activeOpacity = 0,
    inactiveOpacity = 1,
    isActive = false,
    shouldShowLabelWhenInactive = true,
    testID,
}: TabSelectorItemProps) {
    const styles = useThemeStyles();
    const [isHovered, setIsHovered] = useState(false);
    const [betas] = useOnyx(ONYXKEYS.BETAS, { canBeMissing: false });

    const isScanPage = testID === 'scan';

    const { shouldShowProductTrainingTooltip, renderProductTrainingTooltip } = useProductTrainingContext(
        CONST.PRODUCT_TRAINING_TOOLTIP_NAMES.SCAN_TEST_TOOLTIP,
        isActive && isScanPage && !getIsUserSubmittedExpenseOrScannedReceipt() && Permissions.canUseManagerMcTest(betas) && !isUserInvitedToWorkspace(),
        {
            onConfirm: () => { }, // TODO: Add onConfirm
            onDismiss: () => {
                dismissProductTraining(CONST.PRODUCT_TRAINING_TOOLTIP_NAMES.SCAN_TEST_TOOLTIP, true);
            },
        },
    );

    const children = <AnimatedPressableWithFeedback
        accessibilityLabel={title}
        style={[styles.tabSelectorButton, styles.tabBackground(isHovered, isActive, backgroundColor), styles.userSelectNone]}
        wrapperStyle={[styles.flexGrow1]}
        onPress={onPress}
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
        role={CONST.ROLE.BUTTON}
        dataSet={{ [CONST.SELECTION_SCRAPER_HIDDEN_ELEMENT]: true }}
        testID={testID}
    >
        <TabIcon
            icon={icon}
            activeOpacity={styles.tabOpacity(isHovered, isActive, activeOpacity, inactiveOpacity).opacity}
            inactiveOpacity={styles.tabOpacity(isHovered, isActive, inactiveOpacity, activeOpacity).opacity}
        />
        {(shouldShowLabelWhenInactive || isActive) && (
            <TabLabel
                title={title}
                activeOpacity={styles.tabOpacity(isHovered, isActive, activeOpacity, inactiveOpacity).opacity}
                inactiveOpacity={styles.tabOpacity(isHovered, isActive, inactiveOpacity, activeOpacity).opacity}
            />
        )}
    </AnimatedPressableWithFeedback>

    return (
        <>
            <EducationalTooltip
                shouldRender={shouldShowProductTrainingTooltip}
                renderTooltipContent={renderProductTrainingTooltip}
                shouldHideOnNavigate
                anchorAlignment={{
                    horizontal: CONST.MODAL.ANCHOR_ORIGIN_HORIZONTAL.CENTER,
                    vertical: CONST.MODAL.ANCHOR_ORIGIN_VERTICAL.TOP,
                }}
                shiftVertical={5}
                wrapperStyle={styles.productTrainingTooltipWrapper}
            >

                {shouldShowProductTrainingTooltip ? children : <></>}
            </EducationalTooltip>
            <Tooltip
                shouldRender={!shouldShowLabelWhenInactive && !isActive}
                text={title}
            >
                 {!shouldShowProductTrainingTooltip ? children :  <></>}
            </Tooltip>
        </>
    );
}

TabSelectorItem.displayName = 'TabSelectorItem';

export default TabSelectorItem;
