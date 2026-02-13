'use client';

import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Divider,
  Card,
  CircularProgress,
} from '@mui/material';
import { Send, Email, Support, Business, Code, BugReport, ArrowForward } from '@/components/ui/phosphor-icons';
import agent from '@/app/api/agent';
import { toast } from 'react-toastify';

const contactReasons = [
  { value: 'general', label: 'General Inquiry', email: 'hello@scripturespot.com', icon: Support },
  { value: 'partnership', label: 'Partnership Opportunity', email: 'addison@scripturespot.com', icon: Business },
  { value: 'technical', label: 'Technical Support', email: 'hello@scripturespot.com', icon: Code },
  { value: 'feature', label: 'Feature Request', email: 'hello@scripturespot.com', icon: Support },
  { value: 'bug', label: 'Bug Report', email: 'hello@scripturespot.com', icon: BugReport },
  { value: 'content', label: 'Content Suggestion', email: 'hello@scripturespot.com', icon: Support },
  { value: 'media', label: 'Media Inquiry', email: 'hello@scripturespot.com', icon: Business },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    reason: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleReasonChange = (e: any) => {
    setFormData(prev => ({ ...prev, reason: e.target.value }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.reason) newErrors.reason = 'Please select a reason';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setErrors({});

    try {
      const selectedReason = contactReasons.find(r => r.value === formData.reason);
      const targetEmail = selectedReason?.email || 'hello@scripturespot.com';

      await agent.Forms.contact({
        ...formData,
        targetEmail,
        url: typeof window !== 'undefined' ? window.location.href : '',
      });

      toast.success('Thank you for your message! We\'ll get back to you soon.');

      setFormData({
        name: '',
        email: '',
        reason: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      toast.error('There was an error sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
    }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          py: { xs: 6, md: 8 },
          textAlign: 'left',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.02) 0%, transparent 70%)',
            zIndex: 1,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.25rem' },
              fontWeight: 300,
              color: 'text.primary',
              mb: 2,
              letterSpacing: '-0.02em',
            }}
          >
            Contact{' '}
            <Box
              component="span"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #FFFFFF 0%, #CCCCCC 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Us
            </Box>
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '13px', md: '16px' },
              fontWeight: 400,
              color: 'rgba(255, 255, 255, 0.7)',
              maxWidth: '600px',
              lineHeight: 1.6,
            }}
          >
            Have a question, suggestion, or just want to say hello? We'd love to hear from you.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg">

        <Grid container spacing={6}>
          {/* Contact Form */}
          <Grid item xs={12} md={8}>
            <Card
              sx={{
                background: 'rgba(255, 255, 255, 0.02)',
                backdropFilter: 'blur(10px)',
                borderRadius: 4,
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                p: { xs: 4, md: 6 },
              }}
            >
              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="name"
                      label="Your Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      fullWidth
                      error={!!errors.name}
                      helperText={errors.name}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          bgcolor: 'rgba(255, 255, 255, 0.03)',
                          borderRadius: 2,
                          '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.15)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.25)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.4)',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: 'rgba(255, 255, 255, 0.7)',
                          '&.Mui-focused': {
                            color: '#FFD700',
                          },
                        },
                        '& .MuiInputBase-input': {
                          color: 'text.primary',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="email"
                      label="Email Address"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      fullWidth
                      error={!!errors.email}
                      helperText={errors.email}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          bgcolor: 'rgba(255, 255, 255, 0.03)',
                          borderRadius: 2,
                          '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.15)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.25)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.4)',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: 'rgba(255, 255, 255, 0.7)',
                          '&.Mui-focused': {
                            color: '#FFD700',
                          },
                        },
                        '& .MuiInputBase-input': {
                          color: 'text.primary',
                        },
                      }}
                    />
                  </Grid>
                </Grid>

                <FormControl
                  required
                  fullWidth
                  error={!!errors.reason}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: 2,
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.15)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.25)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.4)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                      '&.Mui-focused': {
                        color: '#FFD700',
                      },
                    },
                    '& .MuiSelect-select': {
                      color: 'text.primary',
                    },
                  }}
                >
                  <InputLabel>Reason for Contact</InputLabel>
                  <Select
                    value={formData.reason}
                    onChange={handleReasonChange}
                    label="Reason for Contact"
                  >
                    {contactReasons.map((reason) => {
                      const IconComponent = reason.icon;
                      return (
                        <MenuItem key={reason.value} value={reason.value}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconComponent sx={{ fontSize: 18, color: 'rgba(255, 255, 255, 0.7)' }} />
                            {reason.label}
                          </Box>
                        </MenuItem>
                      );
                    })}
                  </Select>
                  {errors.reason && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                      {errors.reason}
                    </Typography>
                  )}
                </FormControl>

                <TextField
                  name="subject"
                  label="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  fullWidth
                  error={!!errors.subject}
                  helperText={errors.subject}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: 2,
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.15)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.25)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.4)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                      '&.Mui-focused': {
                        color: '#FFD700',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: 'text.primary',
                    },
                  }}
                />

                <TextField
                  name="message"
                  label="Message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  fullWidth
                  multiline
                  rows={6}
                  error={!!errors.message}
                  helperText={errors.message}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: 2,
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.15)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.25)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.4)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                      '&.Mui-focused': {
                        color: '#FFD700',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: 'text.primary',
                    },
                  }}
                />

                <Button
                  type="submit"
                  variant="outlined"
                  disabled={isSubmitting}
                  endIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <ArrowForward />}
                  sx={{
                    backgroundColor: 'transparent',
                    color: '#FFFAFA',
                    fontWeight: 600,
                    py: 2,
                    px: 4,
                    fontSize: '1rem',
                    borderRadius: 1.875,
                    textTransform: 'none',
                    border: '2px solid rgba(255, 255, 255, 0.20)',
                    transition: 'all 0.2s ease',
                    '& .MuiButton-endIcon': {
                      color: '#FFD700',
                    },
                    '@media (hover: hover)': {
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '2px solid rgba(255, 255, 255, 0.30)',
                        color: '#FFD700',
                        transform: 'translateY(-1px)',
                        '& .MuiButton-endIcon': {
                          color: '#FFD700',
                        },
                      },
                    },
                    '&:disabled': {
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      color: 'rgba(255, 255, 255, 0.5)',
                      border: '2px solid rgba(255, 255, 255, 0.10)',
                      transform: 'none',
                      '& .MuiButton-endIcon': {
                        color: 'rgba(255, 255, 255, 0.5)',
                      },
                    },
                  }}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </Box>
            </Card>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Card
                sx={{
                  p: 4,
                  background: 'rgba(255, 255, 255, 0.02)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 4,
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    color: 'text.primary',
                    mb: 3,
                    letterSpacing: '-0.01em',
                  }}
                >
                  Get in Touch
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Email sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.25rem' }} />
                    <Typography variant="body2" sx={{ color: 'text.primary', fontSize: '1rem' }}>
                      hello@scripturespot.com
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                  
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6 }}>
                    We typically respond within 24 hours. For partnership inquiries, your message will be routed directly to our team lead.
                  </Typography>
                </Box>
              </Card>

              <Card
                sx={{
                  p: 4,
                  background: 'rgba(255, 255, 255, 0.02)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 4,
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    color: 'text.primary',
                    mb: 3,
                    letterSpacing: '-0.01em',
                  }}
                >
                  Our Mission
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineHeight: 1.7,
                    mb: 3,
                    fontSize: '1rem',
                  }}
                >
                  We're committed to building tools that help Christians engage more deeply with Scripture and grow in their faith.
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    lineHeight: 1.6,
                    fontStyle: 'italic',
                    fontSize: '0.95rem',
                  }}
                >
                  "Let the word of Christ dwell in you richly..." - Colossians 3:16
                </Typography>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}