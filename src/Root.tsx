import { Composition } from "remotion";
import { IncertidumbreIA } from "./IncertidumbreIA";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="IncertidumbreIA"
      component={IncertidumbreIA}
      durationInFrames={1800}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
