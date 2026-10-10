import { Composition } from "remotion";
import { IncertidumbreIA } from "./IncertidumbreIA";
import { TOTAL_FRAMES } from "./timing";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="IncertidumbreIA"
      component={IncertidumbreIA}
      durationInFrames={TOTAL_FRAMES}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
