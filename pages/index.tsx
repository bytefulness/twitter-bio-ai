import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import DropDown, { VibeType } from "../components/DropDown";
import Footer from "../components/Footer";
import LoadingDots from "../components/LoadingDots";

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState("");
  const [vibe, setVibe] = useState<VibeType>("Professional");
  const [generatedBios, setGeneratedBios] = useState<String>("");

  const bioRef = useRef<null | HTMLDivElement>(null);

  const scrollToBios = () => {
    if (bioRef.current !== null) {
      bioRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const prompt = `Generate 2 ${vibe} twitter biographies with no hashtags and clearly labeled "1." and "2.". ${
    vibe === "Funny"
      ? "Make sure there is a joke in there and it's a little ridiculous."
      : null
  }
      Make sure each generated biography is less than 160 characters, has short sentences that are found in Twitter bios, and base them on this context: ${bio}${
    bio.slice(-1) === "." ? "" : "."
  }. Don't respond to the prompt, just write the bios.`;

  const generateBio = async (e: any) => {
    e.preventDefault();
    setGeneratedBios("");
    setLoading(true);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setGeneratedBios((prev) => prev + chunkValue);
    }
    scrollToBios();
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Bio With AI 🚀</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* <Header /> */}
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
        <section className="bg-white rounded-3xl p-8 md:py-36 md:px-16 w-full max-w-[1330px] mb-9">
          <h1 className="text-3xl md:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-tight mb-12">
            Crafting Memorable Twitter Bios with AI
          </h1>

          <p className="text-lg text-gray-500 max-w-2xl mb-16 mx-auto">
            Unleash the power of cutting-edge AI technology to craft captivating
            Twitter bios that elevate your profile and attract followers. 🚀
          </p>

          <a
            href="#generator"
            className="py-5 px-12 bg-black hover:bg-slate-900 text-gray-100 rounded-[36px] font-semibold"
          >
            Start Generating
          </a>
        </section>

        <section
          id="generator"
          className="bg-white rounded-3xl p-8 md:py-36 md:px-16 w-full max-w-[1330px] mb-9"
        >
          <div className="flex mt-10 items-center space-x-3">
            <p className="text-left font-medium">
              Copy your current bio{" "}
              <span className="text-slate-500">
                (or write a few sentences about yourself)
              </span>
              .
            </p>
          </div>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
            placeholder={
              "e.g. Marketing Manager @Amazon. Tweeting about AI and Startups."
            }
          />
          <div className="flex mb-5 items-center space-x-3">
            <p className="text-left font-medium">
              Select vibe you want for your generated bio.
            </p>
          </div>
          <div className="block">
            <DropDown vibe={vibe} setVibe={(newVibe) => setVibe(newVibe)} />
          </div>

          {!loading && (
            <button
              className="bg-black text-white font-medium py-4 px-12 rounded-[36px] sm:mt-10 mt-8 hover:bg-black/80 w-full"
              onClick={(e) => generateBio(e)}
            >
              Generate your bio &rarr;
            </button>
          )}
          {loading && (
            <button
              className="bg-black rounded-[36px] text-white font-medium py-4 px-12 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              disabled
            >
              <LoadingDots color="white" style="large" />
            </button>
          )}

          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{ duration: 2000 }}
          />

          <div className="space-y-10 my-10">
            {generatedBios && (
              <>
                <div>
                  <h2
                    className="sm:text-4xl text-3xl font-bold tracking-tight text-slate-900 mx-auto mb-2"
                    ref={bioRef}
                  >
                    Your generated bios
                  </h2>

                  <p className="text-lg text-gray-500">
                    Copy your generated bio by clicking on it.
                  </p>
                </div>
                <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                  {generatedBios
                    .substring(generatedBios.indexOf("1") + 3)
                    .split("2.")
                    .map((generatedBio) => {
                      return (
                        <div
                          className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border"
                          onClick={() => {
                            navigator.clipboard.writeText(generatedBio);
                            toast("Bio copied to clipboard", {
                              icon: "✂️",
                            });
                          }}
                          key={generatedBio}
                        >
                          <p>{generatedBio}</p>
                        </div>
                      );
                    })}
                </div>
              </>
            )}
          </div>
        </section>

        <section className="bg-white rounded-3xl p-8 md:py-36 md:px-16 w-full max-w-[1330px]">
          <div className="flex flex-col justify-center items-center">
            <Image
              className="rounded-full mb-4"
              src="/creator.jpg"
              width={120}
              height={120}
              alt="Creator of app"
            />

            <span className="font-semibold text-xl">Erhan AKYEL</span>
            <span className="text-gray-600 font-semibold text-sm mb-9">
              Developer of App
            </span>

            <p className="text-lg text-gray-500 max-w-3xl">
              The completion of this project was undertaken as part of my
              university graduation requirements at Izmır Katip Celebi
              University. I would like to express my gratitude to Associate
              Professor Aytuğ ONAN for providing me with the opportunity to
              develop this project.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Home;
