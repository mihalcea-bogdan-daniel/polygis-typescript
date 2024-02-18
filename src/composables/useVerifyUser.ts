import { useEffect, useState } from 'react'


export default (url?: string) => {
	const [data, setData] = useState(null)
	const [error, setError] = useState<unknown | null>(null)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		(
			async function () {
				try {
					setLoading(true)
					const response = await fetch(`${process.env.BASE_URL}/public/api/v1/users`)
					setData(await response.json())
				} catch (err) {
					setError(err)
				} finally {
					setLoading(false)
				}
			}
		)()
	}, [url])

	return { data, error, loading }
}