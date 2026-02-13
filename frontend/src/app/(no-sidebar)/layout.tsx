import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Box } from '@mui/material';

export default function MinimalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <Box sx={{ maxWidth: '1280px', width: '100%', mx: 'auto', padding: { xs: '20px', sm: '25px', md: '30px' } }}>
        {children}
      </Box>
      <Footer />
    </>
  );
}