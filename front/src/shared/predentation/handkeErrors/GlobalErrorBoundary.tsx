import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { PageError } from "./PageError";

interface Props {
  children: React.ReactNode;
  fallback: (error: Error | null, errorInfo: ErrorInfo | null) => ReactNode; // si se presenta un error, se muestra este componente
  resetConditions?: any; // condiciones para resetear el estado del error boundary
}

interface State {
  hasError: boolean;
  resetConditions?: any;

  error: Error | null; // Almacenar el error
  errorInfo: ErrorInfo | null; // Información adicional del error
}

class ErrorBoundaries extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      resetConditions: props.resetConditions,
      error: null,
      errorInfo: null,
    };
  }

  /**
   * cuando se actualizan las propiedades, se resetea el estado del error boundary
   * @param nextProps entrada de las propiedades
   * @param prevState  estado anterior
   * @returns
   */
  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if (nextProps.resetConditions !== prevState.resetConditions) {
      return { hasError: false, resetConditions: nextProps.resetConditions };
    }
    return null;
  }

  /**
   * si se presenta un error, se muestra el componente fallback
   * @param error
   * @returns
   */
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  /**
   * metodo que captura el error
   * @param error se captura el error
   * @param errorInfo Adicional de información del error
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ error, errorInfo });
    console.error("Un error ha ocurrido en el componente", error, errorInfo);
  }

  /**
   * si se presenta un error, se muestra el componente fallback
   * @returns
   */
  render(): ReactNode {
    if (this.state.hasError) {
      // Pasar el error y la información del error al componente fallback
      return this.props.fallback(this.state.error, this.state.errorInfo);
    }
    return this.props.children;
  }
}

// Wrapper para el ErrorBoundary usando useNavigate
export const ErrorBoundary = (props: Props) => {
  const navigate = useNavigate();

  if (props.children) {
    return <ErrorBoundaries {...props} />;
  }

  // Redirigir a la página de error en caso de error
  // const redirectTo404 = () => {
  //   navigate("/404");
  // };

  return (
    <ErrorBoundaries
      {...props}
      fallback={(_error, _errorInfo) => {
        navigate("/404");
        return <PageError />;
      }}
    />
  );
};
