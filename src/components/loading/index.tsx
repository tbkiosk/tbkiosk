import CircularProgress from "@mui/material/CircularProgress";

import st from "./styles.module.css";

type LoadingProps = {
  isLoading: boolean;
  children: JSX.Element;
};

const Loading = ({ isLoading, children }: LoadingProps) => {
  if (isLoading) {
    return (
      <div className={st.loading}>
        <CircularProgress />
      </div>
    );
  }

  return children;
};

export default Loading;
