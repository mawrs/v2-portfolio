'use client'

import { useState, useRef, useEffect } from 'react'
import { Box, Button, Container, Flex, Heading, Image, Text, VStack, Tabs, TabList, Tab, TabPanels, TabPanel, Card, CardBody, CardFooter, Stack, useColorMode, IconButton, Badge, Link, useColorModeValue, useTheme } from "@chakra-ui/react"
import { Sun, Moon, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import { SocialIcon } from 'react-social-icons'
import React from 'react'
import { darken} from "@chakra-ui/theme-tools"

// Use module augmentation instead of the global namespace declaration
declare module 'react' {
  interface IntrinsicElements {
    'ab-chat-body': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
  }
}

interface ProjectType {
  title: string;
  description: string;
  image: string;
  url: string;
  expanded: {
    role: string;
    team: string;
    challenges: string;
    outcome: string;
  } | false;
}

interface CustomSocialIconProps {
  url: string;
  network: string;
}

interface ChatElementMethods {
  scrollToBottom?: () => void;
  setNewConversation: () => void;
}

interface ChatBodyRefType {
  setNewConversation?: () => void;
}

export const PortfolioComponent = React.forwardRef<HTMLDivElement, Record<string, never>>((props, ref) => {
  const { colorMode, toggleColorMode } = useColorMode()
  const theme = useTheme()
  const bgColor = useColorModeValue("white", "#1A202C") // Chakra UI's gray.900, which looks close to your dark navy
  const userMessageColor = useColorModeValue("#34C759", "#4CD964") // Light and dark mode colors
  const [expandedProject, setExpandedProject] = useState<number | null>(null)
  const [expandFull, setExpandFull] = useState(false)
  const [chatHeight, setChatHeight] = useState(700)
  const resizeRef = useRef<HTMLDivElement>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const chatMethods = useRef<ChatElementMethods | null>(null);
  const chatBodyRef = useRef<ChatBodyRefType>(null);

  const featuredProjects: ProjectType[] = [
    {
      title: "Facebook Project",
      description: "Enhancing user connections on Facebook",
      image: "/facebook.png",
      url: "https://example.com/project-link", // Add this line
      expanded: {
        role: "Product Designer",
        team: "Collaborated with UX Researchers, Product Managers, and a Product Design Manager",
        challenges: "Balancing design exploration with existing Facebook Design System components, understanding previous efforts, and managing complex multi-user systems",
        outcome: "Increased engagement between public figures and audiences by 15%, and saw a 25% increase in comments and reactions from designated top fans"
      }
    },
    {
      title: "Square Project",
      description: "Enhancing email security through design standardization",
      image: "/square.png",
      url: "https://example.com/project-link", // Add this line
      expanded: {
        role: "Product Designer",
        team: "Collaborated with UX Writers, Product Designers, UX Researchers, and a Product Design Manager",
        challenges: "Addressing inconsistent email designs across seven departments, balancing diverse communication needs, and improving seller identification of legitimate Square emails",
        outcome: "Achieved a 12.5% decrease in reported phishing attempts, 70% reduction in financial losses due to email scams, and 90% increase in seller confidence in identifying legitimate Square emails"
      }
    },
    {
      title: "Slide Project",
      description: "Transforming Slide's claim process",
      image: "/slide.png",
      url: "https://example.com/project-link", // Add this line
      expanded: {
        role: "Lead Designer",
        team: "Collaborated with cross-functional teams including UX researchers, product managers, developers, and stakeholders",
        challenges: "Creating a unified and intuitive File a Claim process for new and existing users, simplifying complex insurance information, and developing a scalable design system",
        outcome: "Achieved 89% onboarding completion rate, reduced average onboarding time from 20 to 8 minutes, increased NPS from 32 to 58, and decreased customer support calls by 45%"
      }
    },
  ]

  const sideProjects: ProjectType[] = [
    { title: "Prepitch", description: "Personal project for pitch preparation", image: "/prepitch.png", url: "https://prepitch.xyz/", expanded: false },
    { title: "New Careers", description: "Mobile app design for career transitions", image: "/newcareers.png", url: "https://newcareers.fyi", expanded: false },
    { title: "Audio Nexus", description: "Web app design for audio enthusiasts", image: "/audionexus.png", url: "https://audionexus.ai", expanded: false },
  ]

  const renderProjectCard = (project: ProjectType, index: number, projectType: 'featured' | 'side') => (
    <Card
      key={`${projectType}-${index}-${project.title}`}
      direction={{ base: 'column', sm: 'row' }}
      overflow='hidden'
      variant='outline'
      w="full"
    >
      <Image
        objectFit='cover'
        maxW={{ base: '100%', sm: '200px' }}
        src={project.image}
        alt={project.title}
      />
      <Stack w="full">
        <CardBody>
          <Heading size='md'>{project.title}</Heading>
          <Text py='2'>
            {project.description}
          </Text>
          {projectType === 'featured' && expandedProject === index && project.expanded && (
            <Box mt={4}>
              <Text><strong>Role:</strong> {project.expanded.role}</Text>
              <Text><strong>Team:</strong> {project.expanded.team}</Text>
              <Text><strong>Challenges:</strong> {project.expanded.challenges}</Text>
              <Text><strong>Outcome:</strong> {project.expanded.outcome}</Text>
            </Box>
          )}
        </CardBody>
        <CardFooter>
          <Button
            onClick={projectType === 'featured' 
              ? () => setExpandedProject(expandedProject === index ? null : index)
              : undefined}
            as={projectType === 'side' ? Link : undefined}
            href={projectType === 'side' ? project.url : undefined}
            target={projectType === 'side' ? "_blank" : undefined}
            rel={projectType === 'side' ? "noopener noreferrer" : undefined}
            variant='ghost'
            colorScheme='blue'
            rightIcon={projectType === 'featured' 
              ? (expandedProject === index ? <ChevronUp size={16} /> : <ChevronDown size={16} />)
              : <ExternalLink size={16} />
            }
            sx={{
              '&:hover': {
                textDecoration: 'none',
              }
            }}
          >
            {projectType === 'featured' 
              ? (expandedProject === index ? 'Less' : 'More')
              : 'View Project'
            }
          </Button>
        </CardFooter>
      </Stack>
    </Card>
  )

  const CustomSocialIcon: React.FC<CustomSocialIconProps> = ({ url, network }) => {
    const { colorMode } = useColorMode()

    const getNetworkColor = (network: string) => {
      switch (network) {
        case 'email':
          return '#D44638';
        case 'linkedin':
          return '#0077B5';
        case 'twitter':
          return '#1DA1F2';
        case 'github':
          return '#181717';
        default:
          return colorMode === 'light' ? '#000000' : '#FFFFFF';
      }
    }

    return (
      <Box
        opacity={0.7}
        transition="opacity 0.2s"
        _hover={{ opacity: 1 }}
      >
        <SocialIcon
          url={url}
          network={network}
          bgColor={getNetworkColor(network)}
          fgColor={colorMode === 'light' ? '#FFFFFF' : '#FFFFFF'}
          style={{ width: 40, height: 40 }}
          target="_blank"
          rel="noopener noreferrer"
        />
      </Box>
    )
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const container = containerRef.current
      const span = container?.querySelector('span')
      const shadowRoot = span?.shadowRoot
      const rootChild = shadowRoot?.firstChild as HTMLElement
      const containerChild = rootChild?.firstChild as HTMLElement

      if (containerChild?.scrollHeight > containerChild?.clientHeight) {
        setExpandFull(true)
        clearInterval(interval)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [expandFull])

  // Add this function near your other useEffect hooks
  useEffect(() => {
    const chatContainer = document.querySelector('.chat-container');
    if (chatContainer) {
      const resizeObserver = new ResizeObserver(() => {
        // Use type assertion to avoid TypeScript error
        if (chatMethods.current && typeof chatMethods.current.scrollToBottom === 'function') {
          chatMethods.current.scrollToBottom();
        } else {
          // Fallback: manually scroll to bottom if method is not available
          const chatContent = chatContainer.querySelector('.chat-content');
          if (chatContent) {
            chatContent.scrollTop = chatContent.scrollHeight;
          }
        }
      });
      resizeObserver.observe(chatContainer);
      return () => resizeObserver.disconnect();
    }
  }, []);
  
  const footerBgColor = useColorModeValue(
    darken("gray.100", 5)(theme),  // Slightly darker than gray.100 in light mode
    darken("#1A202C", 5)(theme)  // Slightly darker than the main background in dark mode
  )

  const [isChatVisible, setIsChatVisible] = useState(true);

  const resetChat = () => {
    setIsChatVisible(false);

    setTimeout(() => {
      if (chatBodyRef.current && chatBodyRef.current.setNewConversation) {
        chatBodyRef.current.setNewConversation();
      }
      setIsChatVisible(true);
    }, 50);
  };

  useEffect(() => {
    // This ensures the chat element is only added on the client-side
    const script = document.createElement('script')
    script.src = 'https://client.aidbase.ai/chat.ab.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  useEffect(() => {
    const resizeHandle = resizeRef.current
    let startY: number
    let startHeight: number

    const onMouseDown = (e: MouseEvent) => {
      startY = e.clientY
      startHeight = chatHeight
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    }

    const onMouseMove = (e: MouseEvent) => {
      const deltaY = e.clientY - startY
      const newHeight = Math.max(300, startHeight + deltaY) // Minimum height of 300px
      setChatHeight(newHeight)
    }

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    if (resizeHandle) {
      resizeHandle.addEventListener('mousedown', onMouseDown)
    }

    return () => {
      if (resizeHandle) {
        resizeHandle.removeEventListener('mousedown', onMouseDown)
      }
    }
  }, [chatHeight])

  const chatbotID = process.env.NEXT_PUBLIC_CHATBOT_ID || ''
  const currentTheme = useColorModeValue("light", "dark")

  return (
    <Flex ref={ref} direction="column" minHeight="100vh" bg={bgColor}>
      {/* Navigation */}
      <Box as="nav" borderBottom="1px" borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'} position="sticky" top="0" zIndex="10" bg={colorMode === 'light' ? 'gray.50' : 'gray.800'}>
        <Container maxW="container.xl" py={4}>
          <Flex justify="space-between" align="center">
            <Heading as="h1" size="lg" fontWeight="bold">Martin Tejeda</Heading>
            <Flex gap={2}>
              <Button as="a" href="/resume.pdf" target="_blank" colorScheme="blue">
                Resume
              </Button>
              <IconButton
                aria-label="Toggle color mode"
                icon={colorMode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                onClick={toggleColorMode}
                variant="outline"
                colorScheme={colorMode === 'light' ? 'blue' : 'gray'}
              />
            </Flex>
          </Flex>
        </Container>
      </Box>

      {/* Main content */}
      <Container as="main" maxW="container.xl" py={8} flex="1" display="flex" flexDirection="column">
        <VStack spacing={12} align="stretch">
          {/* About Me */}
          <VStack as="section" spacing={12} align="stretch" py={12}>
            <Flex direction={["column", "row"]} align="stretch" gap={8}>
              <Box width={["100%", "50%"]}>
                <Box borderRadius="md" overflow="hidden">
                  <iframe
                    width="100%"
                    height="300px"
                    src="https://www.youtube.com/embed/Eim7-Pb2eVg"
                    title="Portfolio Creation Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </Box>
                <Flex justify="center" mt={2}>
                  <Badge colorScheme="purple" fontSize="sm" p={2}>
                    Watch how I made this portfolio with AI!
                  </Badge>
                </Flex>
              </Box>
              <Box width={["100%", "50%"]}>
                <Heading as="h2" size="xl" mb={4}>About Me</Heading>
                <Text mb={4}>
                  I&apos;m Martin Tejeda, a product designer and builder with a passion for creating user-centered digital products. As the Head of Design at MDSV Capital, I blend my design expertise with entrepreneurial acumen to craft innovative solutions that drive business growth.
                </Text>
                <Text>
                  I leverage cutting-edge AI tools like V0, Cursor, and Replit to rapidly prototype and build functional products. From UX research and UI design to front-end development and Lean methodology integration, I&apos;m constantly expanding my skill set to deliver intuitive, beautiful, and effective solutions that solve real user problems.
                </Text>
              </Box>
            </Flex>
          </VStack>

          {/* Projects */}
          <Box as="section" py={12}>
            <Heading as="h2" size="xl" mb={8}>Projects</Heading>
            <Tabs variant='enclosed'>
              <TabList>
                <Tab key="featured-tab">Featured Projects</Tab>
                <Tab key="side-tab">Side Projects</Tab>
              </TabList>
              <TabPanels>
                <TabPanel key="featured-panel">
                  <VStack spacing={8}>
                    {featuredProjects.map((project, index) => (
                      <React.Fragment key={`featured-${index}`}>
                        {renderProjectCard(project, index, 'featured')}
                      </React.Fragment>
                    ))}
                  </VStack>
                </TabPanel>
                <TabPanel key="side-panel">
                  <VStack spacing={8}>
                    {sideProjects.map((project, index) => (
                      <React.Fragment key={`side-${index}`}>
                        {renderProjectCard(project, index, 'side')}
                      </React.Fragment>
                    ))}
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </VStack>

        {/* Chat section */}
        <Box as="section" py={8}>
          <Flex justify="space-between" align="center" mb={4}>
            <Heading as="h2" size="xl">Martin AI</Heading>
            <Button onClick={resetChat} colorScheme="blue">New Chat</Button>
          </Flex>
          <Box
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            bg={bgColor}
            boxShadow="md"
            height={`${chatHeight}px`}
            position="relative"
          >
            <Box 
              height="100%" 
              overflowY="auto" 
              mb={0}
              opacity={isChatVisible ? 1 : 0}
              transition="opacity 0.05s"
            >
              {React.createElement('ab-chat-body' as any, {
                ref: (el: HTMLElement | null) => {
                  if (el) {
                    chatMethods.current = el as unknown as ChatElementMethods;
                  }
                },
                chatbotID: chatbotID,
                theme: currentTheme,
                color: userMessageColor
              })}
            </Box>
            {/* Resize handle */}
            <Box
              ref={resizeRef}
              position="absolute"
              bottom="0"
              left="0"
              right="0"
              height="10px"
              cursor="ns-resize"
              bg="transparent"
              _hover={{ bg: useColorModeValue("rgba(0,0,0,0.05)", "rgba(255,255,255,0.05)") }}
              _before={{
                content: '""',
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '30px',
                height: '4px',
                borderRadius: '2px',
                bg: useColorModeValue("gray.300", "gray.600")
              }}
            />
          </Box>
        </Box>
      </Container>

      {/* Footer */}
      <Box as="footer" py={8} bg={footerBgColor}>
        <Container maxW="container.xl">
          <Flex justify="center" gap={6} mb={4}>
            {[
              { url: "mailto:your.hi@martintejeda.com", network: "email" },
              { url: "https://linkedin.com/in/mawrs", network: "linkedin" },
              { url: "https://twitter.com/mawrs", network: "twitter" },
              { url: "https://github.com/mawrs", network: "github" }
            ].map((social, index) => (
              <CustomSocialIcon key={`social-${social.network}-${index}`} url={social.url} network={social.network} />
            ))}
          </Flex>
          <VStack spacing={1} textAlign="center">
            <Text>&copy; 2024 Martin Tejeda</Text>
            <Flex
              direction={{ base: 'column', md: 'row' }}
              align="center"
              justify="center"
              gap={{ base: 1, md: 2 }}
            >
              <Text>Made with <Link href="https://v0.dev/chat" isExternal>V0</Link> + <Link href="https://www.cursor.com/" isExternal>Cursor</Link>.</Text>
              <Text display={{ base: 'none', md: 'inline' }}>&bull;</Text>
              <Text>Styled with <Link href="https://v2.chakra-ui.com/" isExternal>Chakra UI</Link>.</Text>
            </Flex>
          </VStack>
        </Container>
      </Box>
    </Flex>
  )
})

PortfolioComponent.displayName = 'PortfolioComponent'