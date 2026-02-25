import { Box } from '@mui/material';
import { HelpHeader } from '@/component/help/help-header';
import { HelpCategoryCards } from '@/component/help/help-category-cards';
import { HelpFaqSection } from '@/component/help/help-faq-section';

export const Help = () => {
  return (
    <Box>
      <HelpHeader />
      <HelpCategoryCards />
      <HelpFaqSection />
    </Box>
  );
};
