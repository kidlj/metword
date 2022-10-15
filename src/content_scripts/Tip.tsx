import * as React from 'react'
import { Word, IWord } from './Word'
import { browser } from 'webextension-polyfill-ts'
import ErrorMessage from './ErrorMessage'

interface TipProps {
	word: string
	sceneText: string
}

export default function Tip(props: TipProps) {
	const { words, errMessage } = useWords({ key: props.word, msg: { action: 'query', word: props.word } })

	if (errMessage) return (
		<div className='message'>
			<ErrorMessage errMessage={errMessage}></ErrorMessage>
		</div>
	)
	if (!words) return (
		<div className='message'>
			<ErrorMessage errMessage={"Loading..."}></ErrorMessage>
		</div>
	)

	return (
		<div>
			{
				words.map((w) => (<Word key={w.id} word={w} sceneText={props.sceneText} />))
			}
		</div>
	)
}

interface QueryWordsProps {
	key: string
	msg: {
		action: string
		word: string
	}
}

function useWords(props: QueryWordsProps) {
	const [words, setWords] = React.useState<IWord[] | null>(null)
	const [errMessage, setErrMessage] = React.useState<string | false>(false)

	React.useEffect(() => {
		async function sendMessage(msg: { action: string, word: string }) {
			const { data, errMessage } = await browser.runtime.sendMessage(msg)
			setErrMessage(errMessage)
			setWords(data)
		}

		sendMessage(props.msg)
	}, [props.key])

	return { words, errMessage }
}