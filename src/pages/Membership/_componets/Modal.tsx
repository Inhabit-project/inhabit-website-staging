import React, { useRef, useState } from 'react'
import { SiweMessage } from 'siwe'
import { useAccount, useDisconnect, useSignMessage } from 'wagmi'

import Button from '@/components/Base/Button'
import { DOMAIN, SIWE_MESSAGE } from '@/const'
import { User } from '@/models/user.model'
import { accountsService } from '@/services/rest/account'
import { authService } from '@/services/rest/auth'
import { useStore } from '@/store'

type Props = {
	isOpen: boolean
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function Modal(props: Props): JSX.Element {
	// props
	const { isOpen, setIsOpen } = props

	// hooks
	const modalRef = useRef<HTMLDialogElement | null>(null)
	const [isLoading, setIsLoading] = useState<boolean>(false)

	// external hooks
	const { address, chainId } = useAccount()
	const { disconnect } = useDisconnect()
	const { signMessageAsync } = useSignMessage()

	// store
	const fetchUser = useStore(state => state.fetchUser)

	// services
	const { getNonce } = accountsService()
	const { login } = authService()
	const signMessage = async () => {
		setIsLoading(true)

		if (!address || !chainId) {
			return
		}

		try {
			const nonce: string | null = await getNonce(address)

			if (!nonce) {
				throw new Error('Error fetching nonce')
			}

			const issuedAt: string = new Date().toISOString()

			const siweMessage = new SiweMessage({
				...SIWE_MESSAGE,
				address,
				chainId,
				nonce,
				issuedAt,
				domain: DOMAIN
			})

			const message: string = siweMessage.prepareMessage()

			const signature: string = await signMessageAsync({ message })

			const user: User = {
				address,
				nonce,
				message,
				signature
			}

			const response: string | null = await login(user)

			if (!response) {
				throw new Error('Error logging in')
			}

			fetchUser(address)

			// TODO: Handle response
			setIsOpen(false)
		} catch (error) {
			console.error('❌', error)
			// TODO: Handle error
		} finally {
			setIsLoading(false)
		}
	}

	const closeModal = () => {
		disconnect()
		setIsOpen(false)
	}

	return (
		<dialog className='absolute z-50' open={isOpen} ref={modalRef}>
			<div className='fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-gray-800 bg-opacity-75 backdrop-blur'>
				<div className='relative p-4 w-full max-w-md max-h-full bg-white rounded-3xl shadow-xl dark:bg-gray-700'>
					<div className='p-4 md:p-5 text-center'>
						<div className='text-6xl mb-6 flex justify-center'>
							<img
								src='/trusty/trusty_2.png'
								alt='Trusty'
								className='size-52'
							/>
						</div>
						<h3 className='mb-6 text-lg font-bold text-gray-500 dark:text-gray-400'>
							Verify your account
						</h3>
						<p className='mb-6 text-sm text-gray-500 dark:text-gray-400'>
							To finish connecting, you must sign a message in your wallet to
							verify that you are the owner of this account
						</p>
						<Button
							onClick={signMessage}
							className='font-medium rounded-full text-sm inline-flex items-center px-5 py-2.5 text-center hover:transform hover:scale-105'
						>
							{isLoading ? 'Waiting...' : 'Sign message'}
						</Button>
						<button
							onClick={closeModal}
							className='py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-400 focus:z-10 focus:ring-4 focus:ring-gray-100 hover:transform hover:scale-105'
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
		</dialog>
	)
}
