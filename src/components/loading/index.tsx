type LoadingProps = {
  isLoading: boolean;
  children: React.ReactNode | React.ReactNode[];
};

const Loading = ({ isLoading, children }: LoadingProps) => (
  <div>{isLoading ? "Loading..." : children}</div>
);

export default Loading;
