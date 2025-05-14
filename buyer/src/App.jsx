import { useEffect, useRef, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import "./responsive.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./Pages/Home";
import ProductListing from "./Pages/ProductListing";
import { ProductDetails } from "./Pages/ProductDetails";
import { createContext } from "react";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import CartPage from "./Pages/Cart";
import Verify from "./Pages/Verify";
import ForgotPassword from "./Pages/ForgotPassword";
import Checkout from "./Pages/Checkout";
import MyAccount from "./Pages/MyAccount";
import MyList from "./Pages/MyList";
import Orders from "./Pages/Orders";
import toast, { Toaster } from "react-hot-toast";
import { fetchDataFromApi, postData } from "./utils/api";
import Address from "./Pages/MyAccount/address";
import { OrderSuccess } from "./Pages/Orders/success";
import { OrderFailed } from "./Pages/Orders/failed";
import SearchPage from "./Pages/Search";
import Chatboticon from "./components/Chatboticon";
import Chatform from "./components/Chatform";
import Chatmessage from "./components/Chatmessage";
import Chat from "./components/chat";

// import { companyInfo } from "./companyInfo";

const MyContext = createContext();

// Component to handle route-based chatbot visibility
function RouteChecker({ setChatbot }) {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("/login") || location.pathname.includes("/signup")) {
      setChatbot(false);
    } else {
      setChatbot(true);
    }
  }, [location.pathname, setChatbot]);

  return null; // This component doesn't render anything
}

function App() {
  const [openProductDetailsModal, setOpenProductDetailsModal] = useState({
    open: false,
    item: {},
  });
  const [isLogin, setIsLogin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [catData, setCatData] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [myListData, setMyListData] = useState([]);
  const [openCartPanel, setOpenCartPanel] = useState(false);
  const [openAddressPanel, setOpenAddressPanel] = useState(false);
  const [addressMode, setAddressMode] = useState("add");
  const [addressId, setAddressId] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [openFilter, setOpenFilter] = useState(false);
  const [isFilterBtnShow, setisFilterBtnShow] = useState(false);
  const [openSearchPanel, setOpenSearchPanel] = useState(false);

  // Chatbot state
  const [chatHistory, setChatHistory] = useState([
    // {
    //   hideInChat: true,
    //   role: "model",
    //   text: companyInfo,
    // },
  ]);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatbot, setChatbot] = useState(true); // Controls chatbot visibility
  const chatBodyRef = useRef();

  // Chatbot response generation
  const generateBotResponse = async (history) => {
    const updateHistory = (text, isError = false) => {
      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.text !== "Thinking..."),
        { role: "model", text, isError },
      ]);
    };

    history = history.map(({ role, text }) => ({ role, parts: [{ text }] }));

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: history }),
    };

    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL2,
        requestOptions
      );
      if (!response.ok) {
        const text = await response.text();
        console.error("API Error Response:", text);
        throw new Error(`API request failed: ${text}`);
      }

      const data = await response.json();
      const apiResponseText = data.candidates[0].content.parts[0].text
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .trim();
      updateHistory(apiResponseText);
    } catch (error) {
      console.error("Fetch Error:", error.message);
      updateHistory(error.message, true);
    }
  };

  // Auto-scroll chat history
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatHistory]);

  // Existing useEffects
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token !== undefined && token !== null && token !== "") {
      setIsLogin(true);
      getCartItems();
      getMyListData();
      getUserDetails();
    } else {
      setIsLogin(false);
    }
  }, [isLogin]);

  useEffect(() => {
    fetchDataFromApi("/api/category").then((res) => {
      if (res?.error === false) {
        setCatData(res?.data);
      }
    });

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Existing functions
  const handleOpenProductDetailsModal = (status, item) => {
    setOpenProductDetailsModal({
      open: status,
      item: item,
    });
  };

  const handleCloseProductDetailsModal = () => {
    setOpenProductDetailsModal({
      open: false,
      item: {},
    });
  };

  const toggleCartPanel = (newOpen) => () => {
    setOpenCartPanel(newOpen);
  };

  const toggleAddressPanel = (newOpen) => () => {
    if (newOpen == false) {
      setAddressMode("add");
    }
    setOpenAddressPanel(newOpen);
  };

  const getUserDetails = () => {
    fetchDataFromApi(`/api/user/user-details`).then((res) => {
      setUserData(res.data);
      if (res?.response?.data?.error === true) {
        if (res?.response?.data?.message === "You have not login") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          alertBox("error", "Your session is closed please login again");
          setIsLogin(false);
        }
      }
    });
  };

  const alertBox = (type, msg) => {
    if (type === "success") {
      toast.success(msg);
    }
    if (type === "error") {
      toast.error(msg);
    }
  };

  const addToCart = (product, userId, quantity) => {
    if (userId === undefined) {
      alertBox("error", "you are not login please login first");
      return false;
    }

    const data = {
      productTitle: product?.name,
      image: product?.image,
      rating: product?.rating,
      price: product?.price,
      oldPrice: product?.oldPrice,
      discount: product?.discount,
      quantity: quantity,
      subTotal: parseInt(product?.price * quantity),
      productId: product?._id,
      countInStock: product?.countInStock,
      brand: product?.brand,
      size: product?.size,
      weight: product?.weight,
      ram: product?.ram,
    };

    postData("/api/cart/add", data).then((res) => {
      if (res?.error === false) {
        alertBox("success", res?.message);
        getCartItems();
      } else {
        alertBox("error", res?.message);
      }
    });
  };

  const getCartItems = () => {
    fetchDataFromApi(`/api/cart/get`).then((res) => {
      if (res?.error === false) {
        setCartData(res?.data);
      }
    });
  };

  const getMyListData = () => {
    fetchDataFromApi("/api/myList").then((res) => {
      if (res?.error === false) {
        setMyListData(res?.data);
      }
    });
  };

  const values = {
    openProductDetailsModal,
    setOpenProductDetailsModal,
    handleOpenProductDetailsModal,
    handleCloseProductDetailsModal,
    setOpenCartPanel,
    toggleCartPanel,
    openCartPanel,
    setOpenAddressPanel,
    toggleAddressPanel,
    openAddressPanel,
    isLogin,
    setIsLogin,
    alertBox,
    setUserData,
    userData,
    setCatData,
    catData,
    addToCart,
    cartData,
    setCartData,
    getCartItems,
    myListData,
    setMyListData,
    getMyListData,
    getUserDetails,
    setAddressMode,
    addressMode,
    addressId,
    setAddressId,
    setSearchData,
    searchData,
    windowWidth,
    setOpenFilter,
    openFilter,
    setisFilterBtnShow,
    isFilterBtnShow,
    setOpenSearchPanel,
    openSearchPanel,
    // Chatbot context values
    chatHistory,
    setChatHistory,
    generateBotResponse,
    showChatbot,
    setShowChatbot,
    chatbot,
    setChatbot,
  };

  return (
    <>
      <BrowserRouter>
        <MyContext.Provider value={values}>
          <Header />
          <RouteChecker setChatbot={setChatbot} />
          <Routes>
            <Route path="/" exact={true} element={<Home />} />
            <Route path="/products" exact={true} element={<ProductListing />} />
            <Route
              path="/product/:id"
              exact={true}
              element={<ProductDetails />}
            />
            <Route path="/login" exact={true} element={<Login />} />
            <Route path="/signup" exact={true} element={<SignUp />} />
            <Route path="/cart" exact={true} element={<CartPage />} />
            <Route path="/verify" exact={true} element={<Verify />} />
            <Route
              path="/forgot-password"
              exact={true}
              element={<ForgotPassword />}
            />
            <Route path="/checkout" exact={true} element={<Checkout />} />
            <Route path="/my-account" exact={true} element={<MyAccount />} />
            <Route path="/my-list" exact={true} element={<MyList />} />
            <Route path="/my-orders" exact={true} element={<Orders />} />
            <Route path="/order/success" exact={true} element={<OrderSuccess />} />
            <Route path="/order/failed" exact={true} element={<OrderFailed />} />
            <Route path="/address" exact={true} element={<Address />} />
            <Route path="/search" exact={true} element={<SearchPage />} />
          </Routes>
          {showChatbot ? null : <Chat />}
          <Footer />
          <div className={`container ${chatbot ? "" : "hidden"} ${showChatbot ? "show-chatbot" : ""}`}>
            <button
              className="relative z-[142] bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center"
              onClick={() => setShowChatbot((prev) => !prev)}
              id="chatbot-toggler"
            >
              <span className="material-symbols-rounded">mode_comment</span>
              <span className="material-symbols-rounded">close</span>
            </button>

            <div className="chatbot-popup relative z-[142] bg-white rounded-lg shadow-lg">
              <div className="chat-header flex justify-between items-center p-3 bg-gray-100">
                <div className="header-info flex items-center gap-2">
                  <Chatboticon />
                  <h2 className="logo-text text-lg font-semibold">Bert Chatbot</h2>
                </div>
                <button
                  onClick={() => setShowChatbot((prev) => !prev)}
                  className="material-symbols-rounded"
                >
                  keyboard_arrow_down
                </button>
              </div>

              <div ref={chatBodyRef} className="chat-body max-h-96 overflow-y-auto p-3">
                <div className="message bot-message flex items-start gap-2">
                  <Chatboticon />
                  <p className="message-text">
                    Hey there <br /> How can I help you today?
                  </p>
                </div>

                {chatHistory.map((chat, index) => (
                  <Chatmessage key={index} chat={chat} />
                ))}
              </div>

              <div className="chat-footer p-3 border-t">
                <Chatform
                  chatHistory={chatHistory}
                  setChatHistory={setChatHistory}
                  generateBotResponse={generateBotResponse}
                />
              </div>
            </div>
          </div>
        </MyContext.Provider>
      </BrowserRouter>
      <Toaster />
    </>
  );
}

export default App;
export { MyContext };