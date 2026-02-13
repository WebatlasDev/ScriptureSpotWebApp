'use client';

import { Box } from '@mui/material';
import { SwapHorizIcon } from '@/components/ui/phosphor-icons';
import IconActionButton from './IconActionButton';
import { toGlowColor, toHoverColor, toIconColor } from '@/utils/colorUtils';

export interface LanguageConfig {
  label: string;
  themeColor: string;
  Icon?: React.ElementType;
  character?: string;
}

interface StudyToggleGroupProps {
  languageConfig?: LanguageConfig;
  isInterlinearOpen: boolean;
  isCrossReferencesOpen: boolean;
  onToggleInterlinear?: () => void;
  onToggleCrossReferences: () => void;
  onInterlinearHover?: () => void;
  onCrossReferencesHover?: () => void;
  interlinearDisabled?: boolean;
  isMobile?: boolean;
}

const CROSS_REFERENCES_HOVER = 'rgba(255, 193, 7, 0.30)';
const CROSS_REFERENCES_ICON_COLOR = 'rgba(255, 193, 7, 0.90)';
const CROSS_REFERENCES_GLOW = 'rgba(255, 193, 7, 0.15)';
const DISABLED_BASE_COLOR = 'rgba(255, 255, 255, 0.05)';
const DISABLED_TEXT_COLOR = 'rgba(255, 255, 255, 0.45)';

export default function StudyToggleGroup({
  languageConfig,
  isInterlinearOpen,
  isCrossReferencesOpen,
  onToggleInterlinear,
  onToggleCrossReferences,
  onInterlinearHover,
  onCrossReferencesHover,
  interlinearDisabled,
  isMobile,
}: StudyToggleGroupProps) {
  const baseButtonProps = {
    baseColor: 'rgba(255, 255, 255, 0.10)',
    iconColor: 'rgba(255, 255, 255, 0.70)',
    hoverIconColor: 'rgba(255, 255, 255, 1.0)',
    text: undefined as string | undefined,
  };

  const renderInterlinearButton = () => {
    if (!languageConfig || !onToggleInterlinear) {
      return (
        <IconActionButton
          label="Interlinear unavailable"
          icon={<Box component="span" sx={{ fontSize: 15, fontWeight: 600 }}>Aa</Box>}
          hoverColor="rgba(255, 255, 255, 0.20)"
          disabled
          baseColor={DISABLED_BASE_COLOR}
          iconColor={DISABLED_TEXT_COLOR}
          hoverIconColor={DISABLED_TEXT_COLOR}
          text="Interlinear"
        />
      );
    }

    const hoverColor = toHoverColor(languageConfig.themeColor, 0.30);
    const solidIconColor = toIconColor(languageConfig.themeColor, 1.0);
    const glowColor = toGlowColor(languageConfig.themeColor, 0.12);

    // Use character if provided, otherwise use Icon
    const iconElement = languageConfig.character ? (
      <Box component="span" sx={{
        fontSize: 24,
        fontFamily: 'Inter',
        fontWeight: 400,
        color: 'inherit',
        lineHeight: 1,
        display: 'inline-flex',
        alignItems: 'center',
        transform: 'translateY(-2px)'
      }}>
        {languageConfig.character}
      </Box>
    ) : languageConfig.Icon ? (
      <languageConfig.Icon sx={{ fontSize: 18, color: 'inherit' }} />
    ) : null;

    return (
      <IconActionButton
        label={`${languageConfig.label} interlinear`}
        icon={iconElement}
        hoverColor={hoverColor}
        onClick={() => {
          if (interlinearDisabled) return;
          onToggleInterlinear();
        }}
        onMouseEnter={interlinearDisabled ? undefined : onInterlinearHover}
        active={isInterlinearOpen}
        disabled={interlinearDisabled}
        baseColor={interlinearDisabled ? DISABLED_BASE_COLOR : baseButtonProps.baseColor}
        iconColor={interlinearDisabled ? DISABLED_TEXT_COLOR : (isInterlinearOpen ? solidIconColor : baseButtonProps.iconColor)}
        hoverIconColor={interlinearDisabled ? DISABLED_TEXT_COLOR : solidIconColor}
        text={languageConfig.label === 'LOADING...' ? 'Loading...' : languageConfig.label.charAt(0).toUpperCase() + languageConfig.label.slice(1).toLowerCase()}
        textColor="rgba(255, 255, 255, 0.90)"
        glowColor={isMobile ? undefined : glowColor}
      />
    );
  };

  const renderCrossReferencesButton = () => (
    <IconActionButton
      label="Toggle cross references"
      icon={
        <SwapHorizIcon
          sx={{
            fontSize: 22,
            color: 'inherit'
          }}
        />
      }
      hoverColor={CROSS_REFERENCES_HOVER}
      onClick={onToggleCrossReferences}
      onMouseEnter={onCrossReferencesHover}
      active={isCrossReferencesOpen}
      baseColor={baseButtonProps.baseColor}
      iconColor={isCrossReferencesOpen ? CROSS_REFERENCES_ICON_COLOR : baseButtonProps.iconColor}
      hoverIconColor={CROSS_REFERENCES_ICON_COLOR}
      text={isMobile ? 'Cross Refs' : 'Cross References'}
      textColor="rgba(255, 255, 255, 0.90)"
      glowColor={isMobile ? undefined : CROSS_REFERENCES_GLOW}
    />
  );

  return (
    <Box
      sx={{
        display: 'flex',
        gap: { xs: 1, md: 1.5 },
        flexWrap: isMobile ? 'nowrap' : 'wrap',
        flexShrink: 0,
        minWidth: isMobile ? 'max-content' : undefined,
      }}
    >
      {renderInterlinearButton()}
      {renderCrossReferencesButton()}
    </Box>
  );
}
