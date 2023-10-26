import { Container } from "react-bootstrap";
import Header from "./Header";
// import Footer from "./Footer";

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Header />
      <main className="my-4">
        <Container className="d-flex justify-content-center">
          {children}
        </Container>
      </main>
      {/* <Footer /> */}
    </>
  );
};

export default Layout;
