import { Modal } from 'antd'
import { useState } from 'react'

export default function CustomModal() {
	const [open, setOpen] = useState(false);

	// const showModal = () => {
  //   setOpen(true);
  // };

  const hideModal = () => {
    setOpen(false);
  };

	return (
		<Modal
			title="Modal"
			open={open}
			onOk={hideModal}
			onCancel={hideModal}
			okText="Yes"
			cancelText="No"
			centered
		>
		</Modal>
	)
}
