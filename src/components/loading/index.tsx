type LoadingProps = {
  isLoading: boolean
  children: JSX.Element | null | undefined
}

export const Loading = ({ isLoading, children }: LoadingProps): JSX.Element | null => {
  if (isLoading) {
    return (
      <div className="flex grow items-center justify-center h-full w-full">
        <i className="fa-solid fa-spin fa-circle-notch" />
      </div>
    )
  }

  return children || null
}
