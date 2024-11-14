// import React from 'react'
import { ConfigProvider, theme } from "antd";
import Layout from "./components/Layout/Layout";

function App() {
  return (
		<ConfigProvider
			theme={{
				algorithm: theme.darkAlgorithm,
			}}
		>
    	<Layout />
		</ConfigProvider>
  )
}

export default App
