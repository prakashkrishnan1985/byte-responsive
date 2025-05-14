import React, { useEffect, useState } from 'react'
import styles from './Style.scss'
import DisplayComments from './core/DisplayComments'
import { ActionProvider } from './core/ActionContext'
import SignField from './core/SignField'
import Input from './core/Input'

export const CommentSection = ({
  commentsArray,
  currentUser,
  setComment,
  signinUrl,
  signupUrl,
  customInput
}) => {
  const [comments, setComments] = useState(commentsArray)
  useEffect(() => {
    setComments(commentsArray)
  }, [commentsArray])

  return (
    <ActionProvider
      currentUser={currentUser}
      setComment={setComment}
      comments={comments}
      signinUrl={signinUrl}
      signupUrl={signupUrl}
      customInput={customInput}
    >
      <div className={styles.section}>
        <div className={styles.inputBox}>
          {signupUrl && !currentUser ? <SignField /> : <Input />}
        </div>
        <div className={styles.displayComments} style={{background:'white', padding:'5px 30px'}}>
          <DisplayComments comments={comments} />
        </div>
      </div>
    </ActionProvider>
  )
}
