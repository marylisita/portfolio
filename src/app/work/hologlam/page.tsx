/* HoloGlam saiu do portfólio (out/2026). Este arquivo ficou só para o build
   não quebrar até você apagar a pasta src/app/work/hologlam inteira. */
import { redirect } from "next/navigation";

export default function HologlamRemoved() {
  redirect("/work");
}
