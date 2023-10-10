import Header from '@/components/header'

const ProjectsLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Header />
    {children}
  </>
)

export default ProjectsLayout
