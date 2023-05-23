type GradientTextProps = {
  children: string
}

export const GradientText = ({ children }: GradientTextProps) => {
  return (
    <span
      className="text-2xl bg-clip-text"
      style={{
        backgroundImage: 'linear-gradient(99.45deg, #E87A5E 17.5%, #EF7CEE 82.61%)',
        WebkitTextFillColor: 'transparent',
      }}
    >
      {children}
    </span>
  )
}
