import styles from "./button.module.scss"

type ButtonProps = React.PropsWithChildren<{
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}>

const Button: React.VFC<ButtonProps> = ({ children, onClick }: ButtonProps) => {
  return (
    <button className={styles.red} onClick={onClick}>
      {children}
    </button>
  )
}

export default Button
