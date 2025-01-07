interface Props {
  blogFileName?: string;
}
export const AudioPlayer = ({ blogFileName }: Props) => {
  return (
    <audio
      className="w-[60%] h-[35px]"
      controls
      src={`${import.meta.env.DEV ? window.location.origin : ""}/${blogFileName}.mp3`}
    ></audio>
  );
};
