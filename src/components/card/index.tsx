type CardProps = React.HTMLAttributes<HTMLDivElement>

export const Card = ({ children, ...rest }: CardProps) => {
  return (
    <div
      className="rounded-3xl p-10 bg-white transition-shadow shadow-[0_4px_10px_rgba(165,165,165,0.25)] hover:shadow-[4px_4px_10px_rgba(165,165,165,0.25)]"
      {...rest}
    >
      {children}
    </div>
  )
}
