import st from "./styles.module.css";

type LoadingProps = {
  isLoading: boolean;
  children: JSX.Element;
};

const Loading = ({ isLoading, children }: LoadingProps) => {
  if (isLoading) {
    return (
      <div className={st.loading}>
        <i className="fa-solid fa-spin fa-circle-notch" />
      </div>
    );
  }

  return children;
};

export default Loading;
