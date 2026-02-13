import Header from '@/components/layout/Header';
import SidebarColumn from '@/components/layout/SidebarColumn';
import Footer from '@/components/layout/Footer';
import { Box } from '@mui/material';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <Box sx={{ maxWidth: '1280px', width: '100%', mx: 'auto' }}>
        <Box
          sx={{
            display: { xs: 'block', md: 'flex' },
            padding: { xs: '20px', sm: '25px', md: '30px' },
            gap: { xs: '15px', sm: '20px', md: '30px' },
          }}
        >
          <SidebarColumn />
          <Box sx={{ flex: 1, marginTop: { xs: 0, md: 0 }, minWidth: 0 }}>{children}</Box>
        </Box>
      </Box>
      <Footer />
    </>
  );
}
