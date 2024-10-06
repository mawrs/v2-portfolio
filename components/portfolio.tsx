'use client'

import { useState} from 'react'
import { Box, Button, Container, Flex, Heading, Image, Text, VStack, Tabs, TabList, Tab, TabPanels, TabPanel, Card, CardBody, CardFooter, Stack, Input, useColorMode, IconButton, Badge, Skeleton, Link } from "@chakra-ui/react"
import { Send, Sun, Moon, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import { SocialIcon } from 'react-social-icons'

interface ProjectType {
  title: string;
  description: string;
  image: string;
  url?: string;
  expanded?: {
    role: string;
    team: string;
    challenges: string;
    outcome: string;
  };
}

interface CustomSocialIconProps {
  url: string;
  network: string;
}

export function PortfolioComponent() {
  const { colorMode, toggleColorMode } = useColorMode()
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: "Hi! I am Martin's AI assistant. How can I help you with design questions?" }
  ])
  const [userInput, setUserInput] = useState('')
  const [expandedProject, setExpandedProject] = useState<number | null>(null)
  const [isThinking, setIsThinking] = useState(false)

  // Add a new state for artificial delay
  const [artificialDelay, setArtificialDelay] = useState(false)

  const featuredProjects: ProjectType[] = [
    {
      title: "Facebook Project",
      description: "Enhancing user connections on Facebook",
      image: "/facebook.png",
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
      expanded: {
        role: "Lead Designer",
        team: "Collaborated with cross-functional teams including UX researchers, product managers, developers, and stakeholders",
        challenges: "Creating a unified and intuitive File a Claim process for new and existing users, simplifying complex insurance information, and developing a scalable design system",
        outcome: "Achieved 89% onboarding completion rate, reduced average onboarding time from 20 to 8 minutes, increased NPS from 32 to 58, and decreased customer support calls by 45%"
      }
    },
  ]

  const sideProjects: ProjectType[] = [
    { title: "Prepitch", description: "Personal project for pitch preparation", image: "/prepitch.png", url: "https://prepitch.example.com" },
    { title: "New Careers", description: "Mobile app design for career transitions", image: "/newcareers.png", url: "https://newcareers.fyi" },
    { title: "Audio Nexus", description: "Web app design for audio enthusiasts", image: "/audionexus.png", url: "https://audionexus.ai" },
  ]

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (userInput.trim() === '') return

    const newMessages = [
      ...chatMessages,
      { role: 'user', content: userInput }
    ]
    setChatMessages(newMessages)
    setUserInput('')
    setIsThinking(true)

    try {
      const startTime = Date.now();

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: userInput }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Calculate a random delay between 500ms and 1500ms
      const randomDelay = Math.floor(Math.random() * (1500 - 500 + 1)) + 500;
      const elapsedTime = Date.now() - startTime;
      
      if (elapsedTime < randomDelay) {
        setArtificialDelay(true)
        await new Promise(resolve => setTimeout(resolve, randomDelay - elapsedTime))
        setArtificialDelay(false)
      }

      setChatMessages([...newMessages, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error querying AI:', error);
      setChatMessages([...newMessages, { role: 'assistant', content: "I'm sorry, I couldn't process your request at the moment. Can you please try again?" }]);
    } finally {
      setIsThinking(false)
    }
  }

  const renderProjectCard = (project: ProjectType, index: number, projectType: 'featured' | 'side') => (
    <Card
      key={index}
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

  return (
    <Box minHeight="100vh" bg={colorMode === 'light' ? 'gray.50' : 'gray.900'}>
      {/* Navigation */}
      <Box as="nav" borderBottom="1px" borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'} position="sticky" top="0" zIndex="10" bg={colorMode === 'light' ? 'white' : 'gray.800'}>
        <Container maxW="container.xl" py={4}>
          <Flex justify="space-between" align="center">
            <Heading as="h1" size="lg" fontWeight="bold">Martin Tejeda</Heading>
            <Flex gap={2}>
              <Button
                as="a"
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                colorScheme="blue"
              >
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

      <Container as="main" maxW="container.xl" py={8}>
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
                Hi, I am Martin Tejeda, a passionate product designer with over 5 years of experience in creating
                user-centered digital products. I specialize in UX research, UI design, and usability testing.
              </Text>
              <Text>
                My goal is to create intuitive and beautiful interfaces that solve real problems for users.
                I am constantly learning and adapting to new technologies and design trends to deliver the best
                possible solutions.
              </Text>
            </Box>
          </Flex>
        </VStack>

        {/* Projects */}
        <Box as="section" py={12}>
          <Heading as="h2" size="xl" mb={8}>Projects</Heading>
          <Tabs variant='enclosed'>
            <TabList>
              <Tab>Featured Projects</Tab>
              <Tab>Side Projects</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <VStack spacing={8}>
                  {featuredProjects.map((project, index) => renderProjectCard(project, index, 'featured'))}
                </VStack>
              </TabPanel>
              <TabPanel>
                <VStack spacing={8}>
                  {sideProjects.map((project, index) => renderProjectCard(project, index, 'side'))}
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>

        {/* AI Chatbot */}
        <Box as="section" py={12}>
          <Heading as="h2" size="xl" mb={8}>Chat with Martin AI</Heading>
          <Card bg={colorMode === 'light' ? 'white' : 'gray.700'}>
            <CardBody>
              <VStack spacing={4} mb={4} height="300px" overflowY="auto">
                {chatMessages.map((message, index) => (
                  <Flex key={index} justify={message.role === 'user' ? 'flex-end' : 'flex-start'} width="100%">
                    <Box 
                      maxWidth="70%" 
                      p={3} 
                      borderRadius="lg"
                      bg={message.role === 'user' ? 'blue.500' : (colorMode === 'light' ? 'gray.100' : 'gray.600')}
                      color={message.role === 'user' ? 'white' : (colorMode === 'light' ? 'black' : 'white')}
                    >
                      <Text>{message.content}</Text>
                    </Box>
                  </Flex>
                ))}
                {(isThinking || artificialDelay) && (
                  <Flex justify="flex-start" width="100%">
                    <Skeleton 
                      startColor={colorMode === 'light' ? 'gray.100' : 'gray.600'}
                      endColor={colorMode === 'light' ? 'gray.400' : 'gray.300'}
                      height="20px"
                      width="70%"
                      borderRadius="lg"
                    >
                      <Box p={3}>
                        <Text>Thinking...</Text>
                      </Box>
                    </Skeleton>
                  </Flex>
                )}
              </VStack>
              <form onSubmit={handleChatSubmit}>
                <Flex gap={2}>
                  <Input
                    type="text"
                    placeholder="Ask a design question..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    bg={colorMode === 'light' ? 'white' : 'gray.700'}
                  />
                  <Button type="submit" leftIcon={<Send size={16} />} isLoading={isThinking || artificialDelay}>
                    Send
                  </Button>
                </Flex>
              </form>
            </CardBody>
          </Card>
        </Box>

        {/* Footer */}
        <Box as="footer" py={8} bg={colorMode === 'light' ? 'gray.100' : 'gray.800'}>
          <Container maxW="container.xl">
            <Flex justify="center" gap={6} mb={4}>
              <CustomSocialIcon url="mailto:your.hi@martintejeda.com" network="email" />
              <CustomSocialIcon url="https://linkedin.com/in/mawrs" network="linkedin" />
              <CustomSocialIcon url="https://twitter.com/mawrs" network="twitter" />
              <CustomSocialIcon url="https://github.com/mawrs" network="github" />
            </Flex>
            <VStack spacing={1} textAlign="center">
              <Text>&copy; 2024 Martin Tejeda</Text>
              <Text>
                Made with <Link href="https://v0.dev/chat" isExternal>V0</Link> + <Link href="https://www.cursor.com/" isExternal>Cursor</Link>. 
                Styled with <Link href="https://v2.chakra-ui.com/" isExternal>Chakra UI</Link>.
              </Text>
            </VStack>
          </Container>
        </Box>
      </Container>
    </Box>
  )
}