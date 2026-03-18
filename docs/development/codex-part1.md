# THE CODEX

## Part 1 — Foundations of Computer Science

*19 Chapters · Universal Trunk · All Paths*



From electricity to Git, from transistors to Docker — the complete foundational curriculum for understanding how computers work, how software is built, and how developers operate.



| # | Chapter | Focus |

|---|---------|-------|

| 01 | Background | Binary, logic gates, Turing machine |

| 02 | Hardware | CPU, GPU, RAM, storage, motherboard |

| 03 | Data & File Types | Encoding, bytes, file formats |

| 04 | Software | OS, kernel, shell, VMs |

| 05 | Networking & The Internet | HTTP, DNS, APIs, TLS |

| 06 | Programming Languages | Abstraction, types, memory, compile/interpret |

| 07 | Data Structures | Arrays, trees, graphs, hash maps |

| 08 | Programming Constructs | Functions, loops, recursion |

| 09 | Algorithms | Big-O, sorting, search, DP, greedy |

| 10 | Programming Paradigms | OOP, functional, declarative |

| 11 | Concurrency | Threads, async, event loop, race conditions |

| 12 | Databases | SQL, NoSQL, ACID, indexing |

| 13 | Security | Encryption, auth, common attacks |

| 14 | Build Process | Compile to ship, CI/CD |

| 15 | Terminal & Shells | Bash, Zsh, PowerShell, essential commands |

| 16 | Terminal Text Editors | Nano, Vim, Neovim |

| 17 | Linux Distributions & WSL | Distro families, package managers, WSL |

| 18 | Git & Version Control | Commits, branches, GitHub, PRs |

| 19 | Docker & Containers | Images, containers, Compose |


---


---



# Chapter 01 — Background

*Where computation begins — from electricity to logic*

## Overview

Before a single line of code can run, before any operating system loads, before any hardware is assembled — computation itself must be understood. This chapter answers the most foundational question in all of computer science: what does it mean for a machine to think? The answer starts not with silicon, but with an idea.



## 1.1  The Turing Machine

### The Problem Being Solved

In the 1930s, the British mathematician Alan Turing was trying to answer a purely theoretical question: is there a systematic method for solving any mathematical problem? His answer took the form of an imaginary machine — not a physical device, but an abstract model of computation.

### What It Is

A Turing machine consists of three parts: an infinitely long tape divided into cells, each holding a symbol; a read/write head that can move left or right along that tape; and a set of rules that determine what the head does based on the current symbol and the machine's internal state.

The tape is the memory. The head is the processor. The rules are the program. That is all computation is — at its most fundamental level.

### Why It Matters

Turing proved that any problem that can be solved algorithmically can be solved by such a machine. This established the theoretical boundary of what is computable. Modern computers — in all their complexity — are physically realised Turing machines. They can compute anything this abstract model can compute, and nothing more.

The Church-Turing thesis extends this: anything intuitively computable is computable by a Turing machine. This is why computer science can make absolute claims about what is and is not possible in software.



## 1.2  Electricity as Information

### From Physics to Signal

A computer at its physical core is a device that manipulates electricity. But not electricity in the way a light bulb uses it — not as a source of energy to be consumed, but as a carrier of information.

Electricity can exist at different voltage levels. A wire can carry a high voltage (for example, 5 volts or 3.3 volts) or a low voltage (near 0 volts). These two states — high and low — are all the distinction a digital system needs. High voltage is interpreted as 1. Low voltage is interpreted as 0.

### Why Binary — Not the Limitation It Appears to Be

Why only two states? Because reliability demands it. If a system tried to distinguish ten voltage levels (0 through 9), any slight interference — heat, electromagnetic noise, manufacturing variance — could cause a value of 4 to be misread as a 5. Two states are maximally robust. Either a wire is clearly high or clearly low; ambiguity is rare and detectable.

Binary is not a limitation of human imagination. It is the most reliable way to encode information in a physical medium. Everything that follows — all of computer science — is built on this single design decision.



## 1.3  Binary — The Language of Machines

### What Binary Is

Binary is a number system, just like the decimal system most people use. Decimal has ten digits (0 through 9); binary has two (0 and 1). Every number that can be expressed in decimal can be expressed in binary — it just takes more digits.

In decimal, the number 13 means (1 x 10) + (3 x 1). In binary, the number 1101 means (1 x 8) + (1 x 4) + (0 x 2) + (1 x 1) = 13. The same value, represented in a different base.

### Bits and Bytes

A single binary digit — one 0 or one 1 — is called a bit. It is the smallest unit of information a computer works with. On its own a bit can represent only two possible values. Eight bits grouped together form a byte. One byte can represent 256 different values (2 to the power of 8), which is enough to encode every character on a standard keyboard.

### Hexadecimal

Binary is exact but verbose. A single byte already requires eight digits (e.g. 11001101). Hexadecimal — base 16 — provides a compact shorthand. It uses the digits 0 through 9 and the letters A through F to represent values 0 through 15. Every four bits map exactly to one hexadecimal digit, so a full byte becomes just two characters. Developers frequently see hexadecimal in memory addresses, colour codes, and error codes.



## 1.4  Transistors — The Physical Binary Switch

### What Came Before

The earliest computers used mechanical relays — physical switches that could be opened and closed by electromagnets. These worked, but they were slow, loud, and prone to mechanical failure. A single relay could switch perhaps 100 times per second.

### The Transistor

A transistor is a semiconductor device that acts as an electrically controlled switch. Apply a small voltage to its control terminal (called the gate) and the transistor allows current to flow between its other two terminals. Remove the voltage and current is blocked. It is a switch with no moving parts.

The first transistors were invented in 1947 at Bell Labs. They replaced vacuum tubes, which were fragile, power-hungry, and generated enormous heat. Transistors could switch millions of times per second and were small enough to be packaged in components the size of a fingernail.

### The Scale of Miniaturisation

Today, a single processor chip contains billions of transistors. Each one is measured in nanometres — billionths of a metre. The transistors in a modern CPU are smaller than the wavelength of visible light. They are arranged in layers etched onto silicon using a process called photolithography.

Moore's Law — the observation by Intel co-founder Gordon Moore that the number of transistors on a chip roughly doubled every two years — held approximately true from the 1960s through the 2010s. It has since slowed, but the legacy is a doubling of computing power at roughly the same cost, every few years, for six decades.



## 1.5  Logic Gates — From Switches to Decisions

### The Gate as a Decision

A transistor is a switch. A logic gate is a circuit built from transistors that performs a Boolean operation — it takes one or more binary inputs and produces a single binary output according to a fixed rule.

### The Fundamental Gates

- **AND gate:** Output is 1 only if all inputs are 1. Two inputs, both must be high. Models logical conjunction: both this AND that must be true.

- **OR gate:** Output is 1 if at least one input is 1. Either this OR that (or both). The output is only 0 when all inputs are 0.

- **NOT gate:** Inverts its single input. A 1 becomes a 0; a 0 becomes a 1. Also called an inverter.

- **NAND gate:** NOT-AND. Output is 0 only when all inputs are 1; 1 in every other case. Critically, every other gate can be constructed from NAND gates alone — making it a universal gate.

- **NOR gate:** NOT-OR. Universal like NAND. Early computers were built entirely from NOR gates.

- **XOR gate:** Exclusive OR. Output is 1 when inputs differ. Used in arithmetic and error-detection circuits.

### From Gates to Arithmetic

When two or more gates are connected — the output of one feeding the input of another — they form a circuit. A circuit called a half adder, built from one XOR and one AND gate, can add two single bits together, producing a sum bit and a carry bit. Chain multiple adders together and you can add numbers of any size. This is how a CPU performs arithmetic: not with any special mechanism, but with arrangements of simple logic gates.

The leap from 'transistors that act as switches' to 'circuits that perform arithmetic' is the leap from electricity to computation. Everything else is scale and abstraction.



## 1.6  Boolean Logic and Conditions

### Boolean Algebra

George Boole, a 19th-century mathematician, developed an algebraic system for reasoning about true and false values. In Boolean algebra, variables are either true or false (equivalent to 1 and 0), and operations include AND, OR, and NOT. Claude Shannon showed in 1937 that Boolean algebra maps perfectly onto electrical circuits — each variable is a voltage, each operation is a gate. This connection between abstract logic and physical electronics is what made digital computing possible.

### Conditions as the Basis of Decision

A condition is a question with a true or false answer. Is this value greater than that value? Are both of these values equal? Is this value absent? The ability to evaluate conditions and act differently based on the result is what separates a programmable computer from a fixed calculator. Conditional logic — implemented physically by logic gates — is the mechanism by which a machine can choose.

### From Gates to Programs

Every if statement in every programming language, every comparison, every branching decision ultimately reduces to a combination of logic gates evaluating a Boolean expression. The abstraction stack is tall — by the time a developer writes an if statement, they are hundreds of layers above the transistors — but the chain is unbroken. Understanding this is understanding why computers can only do what they are explicitly instructed to do, and nothing more.




> **✅ EXIT CHECK — What you should be able to explain before moving on**

- ✓ Why binary is the foundation of digital computing — and why two states were chosen over more
- ✓ What a transistor does and why it replaced earlier switching technologies
- ✓ What a logic gate is and how AND, OR, and NOT work
- ✓ How arithmetic can emerge from combinations of logic gates
- ✓ What the Turing machine established about the limits of computation
- ✓ What Boolean logic is and how it connects abstract mathematics to physical circuits


---


---



# Chapter 02 — Hardware

*The physical machine — assembled in the mind*

## Overview

Logic gates perform operations. But a working computer requires those operations to be coordinated, persistent, and connected to the physical world. This chapter builds the mental model of a complete computer — component by component — ending with the reader able to understand what each part does, why it exists, and how they cooperate. By the end, the entire machine should exist clearly in the mind.



## 2.1  From Circuits to Chips

### The Integrated Circuit

Individual transistors wired together by hand can make simple logic gates. But building a CPU this way would require billions of individually placed components. The integrated circuit — invented independently in 1958 by Jack Kilby and Robert Noyce — solved this by etching an entire circuit onto a single piece of semiconductor material, typically silicon.

A modern chip is a thin wafer of silicon onto which billions of transistors have been printed using a process involving ultraviolet light and chemical etching. The entire circuit is created at once, with features measured in nanometres, at densities impossible to achieve by hand.

### Types of Chips

Different chips are optimised for different tasks. A CPU (Central Processing Unit) is optimised for general sequential computation — running arbitrary instructions quickly. A GPU (Graphics Processing Unit) is optimised for massively parallel operations. A microcontroller combines a small CPU with memory and I/O on a single chip for embedded applications. An FPGA (Field-Programmable Gate Array) allows its logic to be reconfigured after manufacture — the same physical chip can be 'rewired' in software to implement different circuits.



## 2.2  The CPU — The Machine That Executes Instructions

### What the CPU Does

The CPU is the component that executes instructions. It performs one task: taking an instruction, decoding what it means, performing the corresponding operation, and moving to the next instruction. It does this billions of times per second.

### The Fetch-Decode-Execute Cycle

- **Fetch:** The CPU reads the next instruction from memory. The address of the instruction to fetch is held in a register called the Program Counter (PC), which increments after each fetch.

- **Decode:** The CPU determines what the instruction means — is it an addition? A memory read? A conditional jump to a different instruction?

- **Execute:** The CPU performs the operation using its Arithmetic Logic Unit (ALU) for mathematical operations or its control circuitry for other operations.

This cycle repeats continuously for as long as the CPU is running. A modern CPU performs this cycle billions of times per second, with deep pipelines allowing multiple instructions to be in different stages of the cycle simultaneously.

### Registers

Registers are tiny, extremely fast memory cells built directly into the CPU. They hold the values the CPU is currently working with — the numbers being added, the address being accessed, the result just computed. A typical CPU has between 16 and 32 general-purpose registers. Accessing a register takes less than one clock cycle; accessing RAM takes hundreds. The CPU minimises RAM access by keeping frequently needed values in registers.

### Clock Speed

The clock is the heartbeat of the CPU — a signal that oscillates at a fixed frequency, synchronising all operations. Clock speed is measured in GHz (gigahertz) — billions of cycles per second. A 3 GHz CPU completes up to 3 billion clock cycles per second. However, clock speed alone does not determine performance: different CPUs can complete different numbers of operations per cycle, and memory bottlenecks often matter more than raw clock speed.

### Cores

A core is an independent execution unit within a CPU. A quad-core CPU contains four complete execution units, each capable of fetching, decoding, and executing independently. Multiple cores allow true parallelism — different cores can execute different instructions simultaneously. However, not all software benefits from multiple cores; a single-threaded program will use only one core regardless of how many are available.

### Cache

Between the registers and main RAM sits cache — a small, fast memory built onto the CPU itself. L1 cache is the fastest and smallest (typically 32–256KB per core). L2 is larger and slightly slower. L3 is shared across cores and larger still (often 8–32MB). Cache stores recently or frequently accessed data so the CPU can retrieve it without waiting for main RAM. A cache miss — when needed data is not in cache — forces a much slower RAM access.



## 2.3  RAM — The Workspace

### What RAM Is

Random Access Memory is the computer's active workspace. When a program runs, it is loaded from storage into RAM. When a document is opened, its contents go into RAM. Everything the CPU is actively working with lives in RAM.

RAM is called 'random access' because any location can be read or written in the same time, regardless of its position — unlike older magnetic storage where access time depended on physical location.

### Memory Addresses

RAM is organised as a sequence of bytes, each with a unique address — a number identifying its location. The CPU reads data by specifying an address; the RAM returns the byte (or bytes) stored there. A 64-bit CPU can address up to 2 to the power of 64 bytes of memory — far more than physically exists in any current machine.

### Why RAM Is Temporary

RAM requires constant electrical power to hold its contents. It is made of capacitors that drain between refresh cycles; the memory controller must continuously re-charge them. Cut the power and the capacitors drain — all contents are lost. This is why unsaved work disappears in a crash.

### RAM vs Cache vs Storage

The memory hierarchy exists because of speed-cost tradeoffs. Registers are the fastest and smallest — a few bytes. Cache is fast but small — megabytes. RAM is slower but large — gigabytes. Storage is slowest but persistent and very large — terabytes. The CPU tries to keep needed data as close to the top of this hierarchy as possible.



## 2.4  Storage — The Persistent Layer

### What Storage Is

Storage retains data without power. It is where the operating system, programs, and user files live permanently. When a program starts, it is copied from storage into RAM. When a file is saved, it is written from RAM to storage.

### HDD vs SSD

A Hard Disk Drive (HDD) stores data on spinning magnetic platters. A read/write head moves to the correct position on the spinning disk to read or write. The physical movement introduces latency — milliseconds to seek to the correct track. An HDD can read data at roughly 100–200 MB/s.

A Solid State Drive (SSD) uses flash memory — the same technology as a USB drive. There are no moving parts. Data is read electronically rather than mechanically. Modern SSDs read at 500 MB/s to 7,000 MB/s (NVMe). They are faster, quieter, more durable, and increasingly affordable.

### The Hierarchy Restated

- **Registers:** Bytes | < 1 nanosecond | loses data without power

- **L1/L2/L3 Cache:** Megabytes | 1–10 nanoseconds | loses data without power

- **RAM:** Gigabytes | 50–100 nanoseconds | loses data without power

- **SSD:** Terabytes | 50–100 microseconds | persists without power

- **HDD:** Terabytes | 5–10 milliseconds | persists without power



## 2.5  The GPU — Parallel Processing

### Why the GPU Exists

Displaying a 1920 x 1080 pixel screen at 60 frames per second requires recalculating approximately 124 million pixels every second. Each pixel requires independent mathematical operations. A CPU, optimised for sequential execution with a handful of powerful cores, is poorly suited for this task. The GPU was designed specifically to perform millions of simple operations simultaneously.

### CPU vs GPU Architecture

A CPU has a small number of powerful, complex cores — typically 4 to 32 — optimised for low-latency sequential execution. A GPU has thousands of simpler cores — often 2,000 to 10,000 — optimised for high-throughput parallel execution. The CPU is a generalist; the GPU is a specialist.

### GPU Beyond Graphics

The same parallel architecture that makes GPUs efficient for graphics also makes them ideal for any computation that can be parallelised. Machine learning training, scientific simulation, cryptocurrency mining, and video encoding all run dramatically faster on GPUs than CPUs. Neural networks, for instance, require multiplying large matrices of numbers — an operation that maps perfectly onto thousands of GPU cores working simultaneously.



## 2.6  The Motherboard — Connecting Everything

### What the Motherboard Is

The motherboard is the main circuit board of a computer. It provides the physical connections and electrical pathways through which every component communicates. The CPU, RAM, storage, GPU, and all peripheral devices connect to the motherboard directly or indirectly.

### The Bus

A bus is a communication pathway — a set of electrical lines over which data travels between components. Different buses serve different purposes: the front-side bus connects the CPU to RAM; the PCIe bus connects the CPU to the GPU and NVMe storage; USB, SATA, and other buses connect peripheral devices. The width and speed of a bus — measured in bits and gigabytes per second — determines how much data can move between components at once.

### The Chipset

The chipset is a set of chips on the motherboard that manages communication between the CPU and other components. Modern CPUs integrate much of this functionality directly, but the chipset still handles slower peripherals — USB, audio, network — freeing the CPU for computation.



## 2.7  Input and Output

### The Computer as a Machine with Boundaries

A computer without input cannot receive new information. A computer without output cannot communicate results. Input/output (I/O) devices are the interfaces through which the machine connects to the physical world.

### Input Devices

Input devices convert physical phenomena into electrical signals the CPU can process. A keyboard generates a unique electrical signal for each key press, which is transmitted to the CPU and interpreted as a character. A mouse sends position changes and button states. A microphone converts air pressure waves into voltage variations. A camera sensor converts photons into electrical charges.

### Output Devices

Output devices convert electrical signals into physical phenomena. A monitor receives pixel colour data and illuminates corresponding points on the screen. A speaker receives waveform data and vibrates a diaphragm to produce sound. A printer receives image data and deposits ink.

### I/O as Data

From the CPU's perspective, all I/O is data movement — bytes flowing in from input devices and bytes flowing out to output devices, mediated by device controllers and drivers. The CPU does not understand 'keyboard press' or 'pixel on screen' — it only sees addresses in memory and values at those addresses. The translation between physical events and memory values is handled by device controllers and the operating system.



## 2.8  Power

### What Powers the Machine

A power supply unit (PSU) converts mains AC electricity (alternating current) into the multiple DC (direct current) voltages different components require: 12V for motors and drives, 5V for older components, 3.3V for modern logic circuits. The CPU itself may operate at 1.0V or lower internally — very low voltages switching billions of times per second.

Power consumption and heat are directly related. A modern CPU under full load can consume 65 to 200 watts; a high-end GPU can consume 300 to 450 watts. All of this power becomes heat. Cooling — air cooling through heatsinks and fans, or liquid cooling — is not optional. Sustained high temperatures slow or damage components. Thermal throttling is the CPU's self-protection mechanism: automatically reducing clock speed to prevent damage when temperature exceeds a threshold.




> **✅ EXIT CHECK — What you should be able to explain before moving on**

- ✓ What an integrated circuit is and how billions of transistors fit on a chip
- ✓ The fetch-decode-execute cycle and what registers, clock speed, and cache do
- ✓ Why RAM is fast and temporary, and how memory addresses work
- ✓ The difference between RAM and storage, and why the hierarchy exists
- ✓ Why GPUs exist and what makes them different from CPUs
- ✓ What the motherboard and bus do — how components communicate
- ✓ What input and output mean at the hardware level


---


---



# Chapter 03 — Data & File Types

*How information becomes bytes*

## Overview

The hardware can store and manipulate bits. But bits by themselves mean nothing — the same sequence of 1s and 0s can represent a number, a letter, a colour, or a sound depending entirely on how it is interpreted. This chapter explains how every type of human-meaningful information is encoded into binary, and what a file actually is.



## 3.1  Representing Numbers

### Unsigned Integers

The most direct encoding: binary digits represent the binary expansion of a non-negative integer. One byte can represent 0 through 255. Two bytes can represent 0 through 65,535. Four bytes (a 32-bit integer) can represent over 4 billion values.

### Signed Integers

To represent negative numbers, one common method is two's complement: the most significant bit represents a negative value. In an 8-bit signed integer, the leftmost bit has value -128 (not +128), so the range is -128 to +127. Two's complement is nearly universal in modern hardware because addition and subtraction work identically for signed and unsigned numbers — no special circuitry is needed.

### Floating-Point Numbers

Integers cannot represent decimals. Floating-point encoding uses scientific notation in binary: a number is stored as a sign bit, an exponent, and a mantissa (the significant digits). A 32-bit float (IEEE 754 single precision) can represent an enormous range of values, but with limited precision — roughly 7 significant decimal digits. A 64-bit double provides roughly 15 significant digits. The precision is finite because the mantissa has a fixed number of bits. This is why floating-point arithmetic produces results like 0.1 + 0.2 = 0.30000000000000004 — the exact decimal values cannot be represented in binary floating-point.



## 3.2  Representing Text

### ASCII

The American Standard Code for Information Interchange (ASCII) assigned a unique 7-bit number (0 through 127) to every character needed for English: uppercase and lowercase letters, digits, punctuation, and 33 control characters (tab, newline, etc.). The letter 'A' is 65 in decimal (01000001 in binary). ASCII worked well for English but had no room for accented characters, non-Latin alphabets, or symbols from other writing systems.

### Unicode

Unicode is a universal character set that assigns a unique number — called a code point — to every character in every writing system in the world. Unicode currently defines over 140,000 characters, covering 159 scripts, emoji, and historical writing systems. The code point for 'A' is U+0041; for the Hebrew letter Alef it is U+05D0; for the emoji 'face with tears of joy' it is U+1F602.

### UTF-8

Unicode defines code points, but not how to store them. UTF-8 is the dominant encoding: it represents each code point as 1 to 4 bytes. ASCII characters use a single byte (maintaining backward compatibility). More complex characters use more bytes. UTF-8 is efficient for English text, handles every Unicode character, and is the standard encoding for the web and most modern software.

### Endianness

When a number requires multiple bytes, there are two ways to arrange them in memory. Big-endian stores the most significant byte first; little-endian stores the least significant byte first. The number 0x1234 stored big-endian is: 0x12 then 0x34. Little-endian: 0x34 then 0x12. Most modern CPUs (x86, ARM) are little-endian. Network protocols are big-endian ('network byte order'). Code that sends data across a network must account for this difference.



## 3.3  Representing Images

### Pixels and Colour

A digital image is a grid of pixels — picture elements. Each pixel stores a colour value. In the standard RGB model, each colour is represented by three values: red, green, and blue, each ranging from 0 to 255 (one byte each). Three bytes per pixel means a 1920 x 1080 image requires approximately 6 megabytes of raw pixel data.

### Colour Depth

Colour depth is the number of bits used per pixel. 24-bit colour (8 bits per channel) produces over 16 million possible colours — sufficient for photographic quality. 32-bit colour adds an alpha channel for transparency. Lower bit depths (8-bit, 4-bit) reduce file size but limit colour range, producing visible banding.



## 3.4  Representing Sound

### Sampling

Sound is a continuous pressure wave in air. Digital audio represents it by measuring (sampling) the pressure at regular intervals and recording each measurement as a number. The sample rate — measured in Hz — determines how many samples per second are taken. CD audio uses 44,100 samples per second (44.1 kHz), which captures all frequencies audible to humans (the Nyquist theorem states a sample rate must be at least twice the highest frequency to be accurately reproduced).

### Bit Depth

Each sample is stored as a number; the bit depth determines how precisely. 16-bit audio stores values from -32,768 to +32,767. More bits mean more precision — less quantisation noise, better dynamic range. Professional audio often uses 24-bit samples.



## 3.5  What a File Is

### Bytes on a Storage Device

A file is a sequence of bytes stored on a storage device, associated with a name and metadata. The bytes themselves are just numbers; their meaning depends entirely on interpretation. The same sequence of bytes could be valid JPEG image data, the beginning of a valid executable program, or meaningless noise — context and format determine which.

### File Metadata

Every file has metadata managed by the file system: its name, size, creation date, modification date, permissions (who can read, write, or execute it), and its location on the storage device. This metadata is stored separately from the file's contents.

### File Extensions

A file extension is a suffix to the filename (e.g. .jpg, .txt, .exe). It is a convention to indicate the file's format — the operating system and applications use it to know how to open the file. The extension is not enforced by the file system; renaming a .jpg to .txt does not change the bytes inside, it just changes how the OS tries to open it. A hex editor will still reveal the JPEG header regardless of the extension.



## 3.6  File Formats — Lossless vs Lossy Compression

### Why Compression

Raw data is large. A one-minute uncompressed 1080p video would require roughly 10 gigabytes. Compression reduces file size, either losslessly (perfect reconstruction possible) or lossily (some information is permanently discarded).

### Lossless Compression

Lossless compression removes redundancy without losing information. The original data can be reconstructed exactly. ZIP uses LZ77 compression to find and eliminate repeated patterns. PNG uses DEFLATE compression. Lossless is appropriate for text, code, executable files — anything where every byte matters.

### Lossy Compression

Lossy compression permanently discards information that is difficult for human perception to detect. JPEG discards high-frequency visual detail that the human eye is less sensitive to. MP3 discards audio frequencies that are masked by louder nearby frequencies. The result is a much smaller file that looks or sounds nearly identical — but cannot be decompressed back to the original.



## 3.7  Common File Formats

### Images

- **.jpg / .jpeg:** Lossy compression. Excellent for photographs. Not suitable for logos or text (compression creates visible artefacts on sharp edges). Does not support transparency.

- **.png:** Lossless compression. Supports transparency (alpha channel). Larger than JPEG for photographs but superior for graphics, logos, and screenshots.

- **.gif:** Lossless, limited to 256 colours. Supports simple animation. Largely superseded by video formats for animation.

- **.webp:** Modern format supporting both lossy and lossless compression with transparency. Smaller than JPEG or PNG at comparable quality.

- **.svg:** Not a pixel format — stores vector geometry as XML. Scales infinitely without quality loss. Ideal for logos and icons.

### Audio

- **.wav:** Uncompressed PCM audio. Exactly what came out of the analogue-to-digital converter. Large files. Used for professional audio editing where quality is paramount.

- **.mp3:** Lossy compressed audio. The dominant format for music distribution for two decades. Excellent quality at 128–320 kbps.

- **.flac:** Lossless compressed audio. Smaller than WAV, identical quality. Preferred by audiophiles.

- **.aac:** Lossy, better quality than MP3 at the same bit rate. Used by Apple and for streaming.

### Video

- **Container vs Codec:** A video file has two layers. The container (.mp4, .mov, .avi, .mkv) wraps the data and specifies how audio and video streams are synchronised. The codec (H.264, H.265, AV1, VP9) defines how the video stream is compressed. An .mp4 file can contain H.264 or H.265 video; the container is independent of the codec.

- **H.264:** The dominant video codec for over a decade. Excellent compression, universally supported.

- **H.265 / HEVC:** Roughly half the file size of H.264 at equivalent quality. Slower to encode. Patent licensing costs limited early adoption.

- **AV1:** Open, royalty-free. Better compression than H.265. Gaining adoption in streaming.

### Documents and Code

- **.txt:** Plain text. No formatting. Just bytes representing characters in a specified encoding.

- **.pdf:** Portable Document Format. Encodes document layout precisely — fonts, positions, graphics — ensuring identical appearance across all devices.

- **.docx:** Office Open XML. A ZIP archive containing XML files describing document structure and formatting.

- **.exe / .bin:** Executable files containing machine code that the CPU can execute directly, wrapped in a format the OS understands (PE on Windows, ELF on Linux, Mach-O on macOS).




> **✅ EXIT CHECK — What you should be able to explain before moving on**

- ✓ How integers, decimals, and negative numbers are stored in binary
- ✓ What ASCII, Unicode, and UTF-8 are and how they relate to each other
- ✓ What endianness is and where it matters
- ✓ How images are stored as pixel grids and what colour depth means
- ✓ What sampling rate and bit depth mean for audio
- ✓ What a file actually is — bytes plus metadata
- ✓ The difference between lossy and lossless compression and when each applies
- ✓ The container vs codec distinction in video files


---


---



# Chapter 04 — Software

*The soul of the machine — the layers built on top of hardware*

## Overview

The hardware is assembled. Every component is connected and powered. But a powered machine with no software does nothing — the CPU fetches its first instruction and finds... nothing. This chapter explains the software layers that transform raw hardware into a usable, programmable system: firmware, the operating system, the kernel, the shell, and the virtual machine.



## 4.1  The Bootstrap Problem

### What Happens at Power-On

When a computer is powered on, the CPU immediately begins the fetch-decode-execute cycle. It loads the instruction at a hardcoded memory address and executes it. But RAM is empty — it was wiped when power was off. Something must provide that first instruction.

### Firmware and BIOS/UEFI

The solution is firmware — software stored in non-volatile memory (ROM or flash) permanently attached to the motherboard. It cannot be erased by power loss. The CPU's first instruction address points to this firmware.

The original PC firmware standard was BIOS (Basic Input/Output System). Modern systems use UEFI (Unified Extensible Firmware Interface), which supports larger storage devices, faster boot times, and a graphical interface. The firmware performs POST (Power-On Self Test) — checking that essential hardware is present and functional — then locates and loads the operating system from storage.



## 4.2  The Operating System

### What an OS Actually Is

An operating system is software that manages hardware resources on behalf of programs. This is a precise definition. The OS is not Windows or macOS — those are specific implementations. The concept of an OS is: a layer between programs and hardware that mediates access, enforces rules, and provides abstractions.

### What the OS Manages

- **CPU time:** Multiple programs want to run simultaneously. The OS decides which process runs on which core for how long, switching between them rapidly to create the illusion of simultaneity.

- **Memory:** Every program needs memory. The OS allocates memory regions to processes, prevents them from accessing each other's memory, and manages the virtual memory system.

- **Storage:** The OS provides the file system abstraction — organising raw storage sectors into files and directories that programs can access by name rather than by physical location.

- **Devices:** Every device (keyboard, network card, display) requires specific knowledge to operate. The OS handles this through device drivers, providing programs a uniform interface regardless of the underlying hardware.

### Why the OS Exists

Without an OS, every program would need to include its own code for talking to every possible piece of hardware — every keyboard model, every display adapter, every network card. Programs would conflict over hardware access. One crashed program could corrupt another's memory. The OS solves these problems by being the single, authoritative manager of all hardware resources.



## 4.3  The Kernel

### What the Kernel Is

The kernel is the core of the operating system — the part that runs with full access to hardware. It is the first OS component loaded into memory and the last to be unloaded. Everything else in the OS runs on top of it.

### Kernel Space vs User Space

Modern CPUs support at least two privilege levels. Code running at the highest privilege level (kernel mode, or ring 0) has unrestricted access to all hardware. Code running at lower privilege levels (user mode) can only execute instructions permitted by the hardware's protection mechanisms — it cannot directly access arbitrary memory, cannot access hardware registers, cannot modify CPU configuration.

The kernel runs in kernel space. Every user program — the browser, the text editor, the game — runs in user space. This separation is the fundamental security and stability boundary of a modern operating system. A crashed user-space program cannot corrupt the kernel's memory. A misbehaving program cannot directly write to hardware.

### System Calls

When a user-space program needs something from the kernel — reading a file, allocating memory, sending data over the network — it makes a system call. A system call is a controlled transition from user space to kernel space: the program specifies which kernel function it wants and provides parameters; the CPU switches to kernel mode; the kernel performs the operation and returns the result; the CPU returns to user mode. System calls are the API of the kernel.

### Monolithic vs Microkernel

In a monolithic kernel (Linux, macOS's XNU), the entire kernel runs as a single program in kernel space — device drivers, file systems, networking, process management all share the same memory space. In a microkernel (QNX, seL4), the kernel is minimal — only the most essential functions — and most OS services run as user-space processes. Monolithic kernels are faster; microkernels are more secure and easier to verify.



## 4.4  The Three Major OS Families

### Unix and Linux

Unix was developed at Bell Labs in 1969. Its design philosophy — small tools that do one thing well, composable through piping, everything as a file — has been profoundly influential. Linux, created by Linus Torvalds in 1991, is a Unix-like kernel released under an open-source licence. Combined with the GNU tools (the userspace programs), it forms the GNU/Linux operating system that runs most of the world's servers, Android devices, and a growing share of desktops.

Linux's kernel is monolithic but modular — kernel modules can be loaded and unloaded at runtime. The Linux ecosystem is vast: the same kernel runs on embedded systems drawing milliwatts and supercomputers consuming megawatts.

### macOS

macOS is built on Darwin, an open-source Unix-like OS developed by Apple from the acquisition of NeXT. Darwin uses the XNU kernel — a hybrid combining a Mach microkernel with components from BSD Unix. macOS is fully POSIX-compliant, meaning Unix programs can run on it with minimal modification. The macOS userspace (the UI, applications, frameworks) is proprietary.

### Windows

Windows uses the Windows NT kernel, developed from scratch in the early 1990s. NT is a microkernel-influenced architecture with a monolithic kernel design — it is not Unix-based. Windows maintains extraordinary backward compatibility: programs written for Windows 95 can often still run on Windows 11. Windows dominates consumer desktop market share. The Windows Subsystem for Linux (covered in Chapter 17) bridges the gap for developers who need Unix tools on a Windows machine.



## 4.5  The Shell

### What the Shell Is

The shell is a program that exposes the operating system to the user. It reads commands from the user, interprets them, and executes them. The shell's name comes from its position: it wraps the kernel, which is the core.

A command-line shell presents a text prompt and accepts typed commands. A graphical shell (like the Windows desktop or macOS Finder) presents a visual interface. Both serve the same fundamental purpose — exposing OS capabilities to the user.

### What the Shell Provides

Through the shell, a user can navigate the file system, run programs, redirect input and output, chain commands together, set environment variables, and write scripts that automate sequences of operations. The shell is the developer's primary interface to the system for tasks that benefit from automation, remote access, or precision.



## 4.6  Processes

### What a Process Is

A process is an instance of a running program. When an application is launched, the OS creates a process for it: allocates memory, loads the program's code, and begins execution. The process has its own isolated memory space — it cannot directly read or write another process's memory.

### Process Isolation

Process isolation is a core OS guarantee. If a process crashes, it crashes alone. Its memory is reclaimed. Other processes continue running. Without isolation, a buggy program could corrupt the memory of every other running program — as was possible on early systems without memory protection.

### Context Switching

A modern computer runs many more processes than it has CPU cores. The OS scheduler creates the illusion of simultaneity by rapidly switching between processes — giving each a brief time slice (typically a few milliseconds) before switching to the next. This context switch involves saving the current process's CPU state (all register values) to memory, loading the next process's saved state, and resuming execution. At human time scales, this feels instantaneous. At hardware time scales, context switches are expensive.



## 4.7  Threads

### What a Thread Is

A thread is a unit of execution within a process. Every process starts with one thread; it can create more. All threads within a process share the same memory space — they can directly read and write the same variables, which enables communication but also introduces the risk of data corruption if two threads modify the same data simultaneously.

### Why Threads Are Used

Threads allow a program to do multiple things simultaneously. A web browser has separate threads for the UI, JavaScript execution, network requests, and rendering. Without threads, a slow network download would freeze the entire browser.

### Threads vs Processes

Creating a thread is cheaper than creating a process — threads share memory, whereas processes get separate memory spaces. Thread communication is faster than process communication for the same reason. But threads sharing memory introduces concurrency bugs that separate processes avoid. The tradeoffs between threads and processes are a recurring theme throughout the rest of this curriculum.



## 4.8  Virtual Memory

### The Problem Virtual Memory Solves

If every process directly accessed physical RAM addresses, processes would need to know where in RAM they were loaded — which changes every time. They could accidentally access each other's addresses. And the total memory used by all processes could exceed the physical RAM.

### How Virtual Memory Works

Virtual memory gives each process its own private address space — typically the full 64-bit range on modern systems. The OS and CPU hardware (the Memory Management Unit, or MMU) translate virtual addresses to physical addresses. Process A's virtual address 0x1000 maps to a different physical location than process B's virtual address 0x1000. Neither process can address the other's physical memory.

When physical RAM fills up, the OS can temporarily write some memory contents to storage (the swap file or page file) to free up physical RAM for other processes. This is transparent to the processes — they still see their full virtual address space. However, accessing swapped-out memory is slow; heavy swapping causes significant performance degradation.



## 4.9  SSH and Remote Access

SSH (Secure Shell) is a protocol for securely connecting to a remote computer over a network. It creates an encrypted tunnel through which commands can be sent and output received. From the user's perspective, it provides a shell session on a remote machine — typing commands locally, executing them remotely, seeing the output locally.

SSH is the primary method by which developers access cloud servers, virtual machines, and remote hardware. It uses public-key cryptography: a private key stays on the client machine; a corresponding public key is placed on the server. Authentication requires proving possession of the private key — the private key never leaves the client machine.



## 4.10  Mainframes

A mainframe is a large, high-reliability server designed for intensive transaction processing at scale. Banks, airlines, and governments use mainframes to process millions of transactions per day with near-zero downtime. A mainframe is not architecturally different from any other computer — it runs an OS (typically IBM's z/OS), executes programs, and manages resources. What distinguishes it is reliability engineering: redundant every component, hot-swappable hardware, decades-long guaranteed uptime, and specialised I/O processors dedicated to handling network and storage traffic without burdening the main CPUs.



## 4.11  Virtual Machines

### The Problem VMs Solve

A physical server is expensive and underutilised — most of the time, it sits idle. If ten applications each need their own server, ten physical machines must be purchased, powered, and maintained. Virtual machines allow one physical machine to run multiple isolated instances of an operating system simultaneously.

### How a VM Works

A hypervisor is software (or firmware) that creates and manages virtual machines. It presents each VM with virtual hardware: virtual CPUs, virtual RAM, virtual disk, virtual network. Each VM runs a complete operating system and believes it is running on real hardware. The hypervisor maps virtual hardware operations to the real underlying hardware.

### Type 1 vs Type 2 Hypervisors

A Type 1 hypervisor (bare-metal) runs directly on the hardware without a host OS — VMware ESXi, Microsoft Hyper-V, KVM. It is more efficient and used in production data centres. A Type 2 hypervisor (hosted) runs as a program within a host OS — VirtualBox, VMware Workstation. It is less efficient but simpler for development and testing.

### Containers vs VMs

A VM virtualises an entire machine including the OS kernel. A container shares the host OS kernel and isolates only the application and its dependencies. Containers start in milliseconds rather than the seconds a VM needs to boot. They use far less memory. Docker, covered in Chapter 19, is the dominant container system. The tradeoff: VMs provide stronger isolation (separate kernels); containers are lighter and faster.

### VMs and the Internet

The internet's server infrastructure runs predominantly on virtual machines. A cloud provider like AWS purchases massive physical servers and uses hypervisors to divide them into thousands of smaller VMs. Customers rent these VMs by the hour. This is how one physical data centre can simultaneously serve millions of isolated customer workloads — the foundation of cloud computing.




> **✅ EXIT CHECK — What you should be able to explain before moving on**

- ✓ What happens when a computer powers on and why firmware is necessary
- ✓ What an operating system is — precisely what it manages and why
- ✓ What the kernel is, what kernel space vs user space means, and what a system call is
- ✓ The architectural difference between Linux, macOS, and Windows
- ✓ What a process is, what process isolation provides, and how context switching works
- ✓ What a thread is and how it differs from a process
- ✓ How virtual memory works and what problem it solves
- ✓ What a virtual machine is and how it differs from a container


---


---



# Chapter 05 — Networking & The Internet

*How machines communicate with each other*

## Overview

Virtual machines at the end of the last chapter are the foundation of modern cloud infrastructure. But isolated machines are limited. The internet is the system that connects billions of machines — allowing them to exchange data instantly, reliably, and securely. This chapter explains how that system works, from the physical cables to the web page in a browser.



## 5.1  The Internet vs The Web

These two terms are not interchangeable, and the confusion is pervasive.

The internet is a global network of networks — billions of devices connected by physical cables, fibre optics, wireless links, and satellite connections, all using a common set of communication protocols. It is the infrastructure.

The World Wide Web is a system of documents and resources — web pages, images, videos — accessible over the internet using the HTTP protocol. It is one application running on top of the internet. Email, SSH, file transfer, video calls, and online games are also applications running on the internet — they are not the web.



## 5.2  IP Addresses

### The Problem of Identification

For one machine to send data to another, it needs to know where that machine is. IP addresses are the addressing system of the internet.

### IPv4

An IPv4 address is a 32-bit number, conventionally written as four decimal groups separated by dots: 192.168.1.1. With 32 bits, IPv4 can represent approximately 4.3 billion unique addresses. This seemed sufficient in the 1970s; the explosive growth of the internet exhausted the available space, leading to various conservation measures and the development of IPv6.

### IPv6

An IPv6 address is 128 bits, written as eight groups of four hexadecimal digits: 2001:0db8:85a3:0000:0000:8a2e:0370:7334. 128 bits provides 340 undecillion (3.4 × 10^38) unique addresses — effectively unlimited for foreseeable needs. IPv6 adoption is now widespread but IPv4 remains dominant due to the enormous installed base of equipment.

### Public vs Private Addresses

Not all IP addresses are globally routable. Private address ranges (192.168.x.x, 10.x.x.x, 172.16.x.x to 172.31.x.x) are used within local networks and are not directly accessible from the internet. NAT (Network Address Translation) allows many devices sharing private addresses to access the internet through a single public IP.



## 5.3  DNS — The Internet's Address Book

Humans remember names like google.com; computers route data to IP addresses like 142.250.185.46. DNS (Domain Name System) is the distributed database that translates between them.

When a browser navigates to a URL, it queries a DNS resolver (typically provided by the ISP or configured manually, e.g. 8.8.8.8 for Google's resolver). The resolver queries a hierarchy of DNS servers — root servers, top-level domain servers (.com, .org, .io), then authoritative nameservers — to find the IP address associated with the domain. The result is cached locally for a period defined by the TTL (Time to Live) value.

DNS is a critical infrastructure component. A DNS failure for a domain makes it unreachable even if the server itself is fully operational. DNS is also a security surface: DNS hijacking (redirecting a legitimate domain to a malicious IP) and DNS amplification attacks are common attack vectors.



## 5.4  Packets and Routing

### Why Packets

Sending an entire file as a continuous stream over a network would require maintaining an exclusive connection for the entire duration. Packets solve this: data is broken into small chunks (typically 1,500 bytes for Ethernet), each labelled with source and destination addresses and a sequence number. Packets from different sources can share the same physical links, and packets from the same transmission can take different routes through the network.

### Routing

Routers are specialised devices that forward packets toward their destination. Each router maintains a routing table — a list of network prefixes and the next hop (the next router) toward them. When a packet arrives, the router looks up the destination IP, finds the best matching prefix in its table, and forwards the packet to the corresponding next hop. This process repeats at each router across the internet until the packet reaches its destination.



## 5.5  TCP and UDP

### The Transport Layer

IP delivers packets to a machine. The transport layer — TCP or UDP — delivers data to a specific application on that machine, and provides additional guarantees (or deliberately omits them for speed).

### TCP

TCP (Transmission Control Protocol) provides reliable, ordered, error-checked delivery. Before any data is sent, TCP establishes a connection via a three-way handshake: the client sends SYN; the server responds SYN-ACK; the client sends ACK. Once connected, the sender tracks which packets the receiver has acknowledged. Unacknowledged packets are retransmitted. Data arrives in the correct order. This reliability has overhead — latency from acknowledgements, retransmission delays.

TCP is used for HTTP, email, SSH, database connections — any application where data correctness matters more than latency.

### UDP

UDP (User Datagram Protocol) is connectionless. Packets are sent without handshaking, without acknowledgement, without ordering guarantees. Some packets may be lost or arrive out of order — the application must handle this if it matters. The advantage is minimal overhead and low latency.

UDP is used for video streaming, online games, DNS lookups, and VoIP — applications where a slightly dropped packet is preferable to waiting for a retransmission.



## 5.6  Ports

A single machine can run many network services simultaneously — a web server, an SSH server, a database. Ports differentiate them. A port is a 16-bit number (0 through 65,535) appended to an IP address. When a packet arrives at a machine, the OS uses the port number to deliver it to the correct application.

Well-known ports are standardised: HTTP is port 80; HTTPS is port 443; SSH is port 22; SMTP email is port 25. When a browser connects to https://example.com, it connects to port 443 of that server's IP address. Applications can also use any unprivileged port (1024+) for custom services.



## 5.7  TLS and HTTPS

### Why Encryption Is Necessary

Data transmitted over a network passes through many intermediate routers. Any of these could inspect or modify the data. Without encryption, passwords, credit card numbers, and private messages could be read by anyone with access to the network path.

### TLS

TLS (Transport Layer Security) is the protocol that encrypts network connections. It operates between the transport layer (TCP) and the application layer (HTTP). TLS provides three guarantees: confidentiality (data cannot be read by intermediaries), integrity (data cannot be modified without detection), and authentication (the server's identity can be verified).

### The TLS Handshake

Before encrypted data flows, TLS performs a handshake: the server sends its digital certificate (containing its public key and identity, signed by a trusted Certificate Authority); the client verifies the certificate; client and server negotiate a shared symmetric encryption key (using asymmetric cryptography); subsequent communication uses the faster symmetric key. This takes one or two additional round trips before data transfer begins.

### HTTPS

HTTPS is simply HTTP running over a TLS connection. The 'S' means 'Secure'. The padlock in a browser address bar indicates a TLS connection is active. HTTPS should be the default for any site that transmits user data — and for all sites since search engines penalise non-HTTPS sites.



## 5.8  HTTP — How the Web Works

### The Request-Response Model

HTTP (Hypertext Transfer Protocol) is a request-response protocol: a client sends a request; the server sends a response. Every web page load, every API call, every image download is one or more HTTP exchanges.

### HTTP Methods

- **GET:** Retrieve a resource. Should be idempotent — multiple identical GETs produce the same result.

- **POST:** Submit data to create a resource or trigger an action.

- **PUT:** Replace a resource entirely.

- **PATCH:** Partially update a resource.

- **DELETE:** Remove a resource.

### HTTP Status Codes

- **2xx Success:** 200 OK, 201 Created, 204 No Content

- **3xx Redirection:** 301 Moved Permanently, 302 Found (temporary redirect)

- **4xx Client Error:** 400 Bad Request, 401 Unauthorised, 403 Forbidden, 404 Not Found

- **5xx Server Error:** 500 Internal Server Error, 503 Service Unavailable

### HTTP Headers

HTTP requests and responses include headers — key-value pairs providing metadata. Request headers include information like the client's accepted content types, cookies, and authentication tokens. Response headers include content type, caching directives, and security policies.



## 5.9  APIs and REST

### What an API Is in the Web Context

An API (Application Programming Interface) on the web is an HTTP endpoint that applications call to exchange structured data. Rather than returning HTML for a browser to display, it returns data (typically JSON) for another application to use.

### REST

REST (Representational State Transfer) is an architectural style for APIs. A RESTful API models resources as URLs and uses HTTP methods to operate on them. The user resource might be at /users; GET /users lists all users; GET /users/42 retrieves user 42; POST /users creates a new user; DELETE /users/42 deletes user 42. Resources are stateless — each request contains all information needed to process it; the server maintains no session state.

### JSON

JSON (JavaScript Object Notation) is the dominant data format for APIs. It is human-readable, language-agnostic, and directly parseable by JavaScript. It supports strings, numbers, booleans, null, arrays, and objects. Almost every API in use today returns JSON.



## 5.10  WebSockets

HTTP is request-response — the server can only send data when the client asks. For real-time applications (chat, live dashboards, multiplayer games), this is insufficient. WebSockets provide a persistent, bidirectional connection: after an initial HTTP handshake that upgrades the connection, both client and server can send messages to each other at any time without a new request. This is how live chat, collaborative editing, and live sports scores work.



## 5.11  The Cloud

The cloud is not a place or a technology — it is a business model for computing infrastructure. Cloud providers (AWS, Google Cloud, Azure, and others) own enormous data centres full of physical servers. They use virtualisation to divide these servers into smaller virtual machines and rent them to customers by the hour, minute, or second.

The customer benefits: no upfront hardware cost, instant provisioning, global distribution, and the ability to scale capacity up and down as needed. The provider benefits: maximum utilisation of expensive hardware across thousands of customers.

A CDN (Content Delivery Network) is a specific cloud service: a globally distributed network of servers that cache content close to end users. When a user in Tokyo requests an image from a CDN, the CDN serves it from a nearby Tokyo server rather than the origin server in the US, reducing latency from hundreds of milliseconds to single digits.




> **✅ EXIT CHECK — What you should be able to explain before moving on**

- ✓ The difference between the internet and the World Wide Web
- ✓ What an IP address is and why DNS exists
- ✓ What packets are and why data is broken into them
- ✓ The difference between TCP and UDP and when each is used
- ✓ What a port is and why they exist
- ✓ What TLS does and what the three guarantees of a secure connection are
- ✓ How HTTP works — methods, status codes, and the request-response model
- ✓ What a REST API is and what JSON is
- ✓ What the cloud is as a business model


---


---



# Chapter 06 — Programming Languages

*How humans write instructions for machines*

## Overview

The CPU only understands machine code — binary numbers representing operations. Writing machine code directly is possible but inhuman in scale. Programming languages exist to let humans express intentions in readable form, then translate that expression down to the binary the CPU can execute. This chapter covers the entire translation stack, from machine code to modern type systems.



## 6.1  Machine Code

Machine code is the set of binary instructions that a specific CPU architecture executes directly. Each instruction is a number encoding an operation (the opcode) and its operands. ADD might be opcode 0x01; MOV opcode 0x89. The CPU's decode stage reads this number and activates the corresponding circuitry.

Machine code is architecture-specific. x86 machine code does not run on an ARM processor — their instruction sets (the full list of operations a CPU supports) are different. This is why a Windows executable does not run natively on an iPhone, and why software compiled for an Intel Mac requires a compatibility layer (Rosetta 2) on an Apple Silicon Mac.



## 6.2  Assembly Language

Assembly language replaces binary opcodes with human-readable mnemonics: MOV instead of 0x89, ADD instead of 0x01, JMP instead of 0xEB. An assembler translates assembly source into machine code — a straightforward one-to-one mapping, one assembly instruction per machine instruction.

Assembly is still architecture-specific. Writing in assembly requires knowing the exact register names, instruction set, and calling conventions of the target CPU. It is used today for performance-critical inner loops, boot code, device drivers in embedded systems, and security research. Almost no application software is written in assembly.



## 6.3  The Abstraction Ladder

Higher-level languages add abstraction — they express ideas in human terms and let the translator (compiler or interpreter) handle the translation to machine instructions. The further up the ladder, the less the programmer controls about what the machine actually does, but the more productive they can be.

- **Assembly:** 1-to-1 mapping to machine instructions. Full control, maximum effort.

- **C:** Structured programming, portable across architectures, manual memory management. Close to the metal but significantly more readable than assembly.

- **C++ / Rust:** Adds classes, generics, and (in Rust's case) memory safety guarantees. Still highly efficient.

- **Java / C# / Go:** Managed runtime with garbage collection. Portable bytecode. Higher productivity, moderate performance.

- **Python / JavaScript / Ruby:** Dynamic typing, garbage collection, concise syntax, extensive standard libraries. Very high productivity, lower raw performance.

The tradeoff at every rung: control and performance vs productivity and safety. There is no universally best language — only the right language for a given problem and context.



## 6.4  Compilation

### What a Compiler Does

A compiler translates an entire source program from one language to another — typically from a high-level language to machine code or an intermediate representation. This translation happens before the program runs.

### The Compilation Pipeline

- **Lexing:** The source text is broken into tokens — the smallest meaningful units: keywords, identifiers, operators, literals.

- **Parsing:** Tokens are arranged into an Abstract Syntax Tree (AST) — a tree structure representing the grammatical structure of the program. This step enforces syntax rules.

- **Semantic analysis:** The AST is checked for logical correctness: are types compatible? Are variables declared before use? Do function calls match their signatures?

- **Optimisation:** The compiler transforms the program to be faster or smaller without changing its behaviour — removing unused code, inlining small functions, reordering operations.

- **Code generation:** The optimised representation is translated to the target language (machine code, bytecode, etc.).

### Why Compilation Produces Fast Programs

Because all translation work is done before the program runs. At runtime, the CPU executes the pre-translated machine code directly — no parsing, no type checking, no translation overhead. Languages compiled to native machine code (C, C++, Rust, Go) achieve the highest raw performance.



## 6.5  Interpretation

An interpreter reads and executes source code directly, without first translating the entire program to machine code. It processes the program line by line (or statement by statement) at runtime, translating and executing each piece as it goes.

The advantage: flexibility. Code can be executed without a separate compilation step. Code can be generated and executed at runtime (eval). Interactive sessions (REPLs) are easy to implement. The disadvantage: translation overhead at every execution — the same line of code is re-translated every time it runs.

Early Python and early JavaScript were purely interpreted. This made them slower than compiled languages for CPU-intensive tasks.



## 6.6  JIT Compilation

Just-In-Time compilation combines interpretation and compilation. The program starts interpreted, collecting profiling information about which parts execute most frequently (the 'hot path'). These hot sections are then compiled to native machine code at runtime, while cold paths remain interpreted.

The V8 engine (JavaScript in Chrome and Node.js) uses aggressive JIT compilation. Modern JavaScript running under V8 approaches the speed of compiled languages for many workloads — a remarkable achievement for a language that was purely interpreted in its early years. The JVM (Java) and .NET CLR (C#) also use JIT compilation.



## 6.7  The Runtime

A runtime is the environment in which a program executes — the combination of compiled or interpreted code plus the supporting infrastructure provided by the language implementation. The runtime typically includes: a garbage collector (if the language has one), standard library code, type system enforcement, and the mechanisms for system calls and I/O.

The JavaScript runtime in a browser (V8, SpiderMonkey, JavaScriptCore) provides not just the JS engine but the event loop, Web APIs, and the connection between JavaScript code and browser capabilities. Node.js is the V8 runtime extracted from the browser and given access to the file system and networking.



## 6.8  Type Systems

### What a Type Is

A type is a classification of a value that determines what operations are valid on it. The number 42 is an integer type — you can add it, multiply it, compare it numerically. The string 'hello' is a string type — you can concatenate it, take its length, convert it to uppercase. Adding an integer to a string is a type error — the operation is not defined for that combination of types.

Types exist because the CPU has no concept of 'this number is actually a string' — it just has bits. Types are a programming language's way of ensuring that the bits being manipulated are being interpreted correctly.

### Static Typing

In a statically typed language, types are checked at compile time. Every variable, parameter, and return value has a declared type. The compiler verifies type correctness before the program runs. Type errors are caught before any user sees them. Examples: C, C++, Java, TypeScript, Rust, Go.

### Dynamic Typing

In a dynamically typed language, types are checked at runtime. Variables do not have types — values do. A variable that holds a number today can hold a string tomorrow. Type errors only appear when the offending line of code actually executes. Examples: Python, JavaScript (without TypeScript), Ruby.

### Strong vs Weak Typing

A strongly typed language refuses implicit type conversions that would be surprising. Python is strongly typed: 1 + '1' raises a TypeError. JavaScript is weakly typed: 1 + '1' produces '11' — the number is silently converted to a string. Weak typing can produce unexpected behaviour because errors pass silently.

### Type Inference

Static typing traditionally required verbose type annotations on every variable. Modern type inference systems — in TypeScript, Rust, Swift, Kotlin, and Go — analyse how variables are used to automatically determine their type. The programmer gets the safety of static typing with much of the conciseness of dynamic typing.



## 6.9  Memory Management

### The Problem

Programs need memory to store data — variables, objects, strings, collections. Memory must be allocated before use and released after use. Failing to release memory that is no longer needed causes a memory leak — eventually exhausting available memory. Releasing memory that is still in use causes a use-after-free bug — a severe security vulnerability.

### Manual Memory Management

In C and C++, the programmer explicitly allocates memory (malloc/calloc/new) and explicitly frees it (free/delete). This gives complete control and zero overhead, but requires discipline. Every allocation must have exactly one corresponding deallocation. Memory management bugs are the source of a majority of security vulnerabilities in C/C++ programs.

### Garbage Collection

A garbage collector automatically tracks which memory is still reachable from the program and periodically reclaims memory that is not. The programmer allocates memory; the GC frees it when appropriate. Languages with GC: Java, C#, Python, Go, JavaScript. The cost: GC pauses (brief periods where the program stops while the collector runs), and overhead from tracking references. Modern GCs are sophisticated and often achieve sub-millisecond pause times.

### Reference Counting

A simpler form of automatic memory management: every object tracks how many references point to it. When the count drops to zero, the object is immediately freed. Python uses reference counting (with a supplemental cycle detector). Swift and Objective-C use ARC (Automatic Reference Counting), which inserts retain and release calls at compile time.

### Rust's Ownership Model

Rust achieves memory safety without a garbage collector through its ownership system: every value has exactly one owner; when the owner goes out of scope, the value is freed. The borrow checker enforces this at compile time — programs with memory errors simply do not compile. Rust achieves C-like performance with memory safety guarantees. This is covered in depth in Path 4.



## 6.10  Pointers

A pointer is a variable that holds a memory address — rather than a value itself, it holds the location where a value is stored. Dereferencing a pointer reads or writes the value at that address.

Pointers enable powerful patterns: passing large data structures without copying them, implementing linked data structures (linked lists, trees), and interfacing directly with hardware. They also introduce danger: a null pointer dereference crashes the program; a dangling pointer (pointing to freed memory) is a security vulnerability; arithmetic errors with pointers can read or write arbitrary memory.

High-level languages hide pointers behind references or handle them automatically. C, C++, and Rust expose them directly with varying levels of safety.



## 6.11  Scope

Scope defines where in a program a variable name is visible and accessible. A variable declared inside a function is typically not accessible outside it — it is local scope. A variable declared at the top level of a file may be accessible throughout the file — module scope. A variable declared outside any function with no restrictions is global scope.

Scope is how programming languages prevent name collisions (two different functions can each have a local variable named 'count' without interfering) and control the lifetime of variables (a local variable exists only while its enclosing function executes).




> **⚡  PATH SPLIT — Choose Your Track**

| | LOW-LEVEL TRACK | HIGH-LEVEL TRACK |
|---|---|---|
| Languages | C → C++ → Rust | JavaScript → TypeScript |
| Focus | Hardware control, systems programming, OS development, embedded, performance-critical code | Web, mobile, desktop apps, data science, AI integration, product development |

Chapter 6 is the branching point. The concepts covered here — types, memory, compilation, abstraction — apply to all programming languages. What changes between tracks is the specific problems each level of abstraction is designed to solve.






> **✅ EXIT CHECK — What you should be able to explain before moving on**

- ✓ Why machine code is architecture-specific and what an instruction set is
- ✓ What a compiler does — the stages from source code to executable
- ✓ The difference between a compiled, interpreted, and JIT-compiled language
- ✓ What a runtime is
- ✓ The difference between static and dynamic typing
- ✓ What strong vs weak typing means and why it matters
- ✓ The three main approaches to memory management and their tradeoffs
- ✓ What a pointer is and why it is both powerful and dangerous
- ✓ What scope is and why it exists


---


---



# Chapter 07 — Data Structures

*The ways computers organise information*

## Overview

Programs deal with data. A single value sitting in a variable is limited. The real challenge is organising collections of values — storing them, retrieving them efficiently, expressing relationships between them. Data structures are the established patterns for this. Choosing the right data structure for a problem is often more impactful than any other design decision.



## 7.1  Primitive Types — Single Values

Primitive types are the foundational value types provided by a language. They map directly to operations the CPU can perform.

- **Integer:** A whole number — no decimal point. Stored as a fixed number of bits. An 8-bit integer holds 0–255 (unsigned) or -128 to 127 (signed). A 32-bit integer holds approximately ±2 billion. A 64-bit integer holds approximately ±9 quintillion.

- **Float / Double:** A number with a decimal component, stored in IEEE 754 floating-point format. Float uses 32 bits; double uses 64 bits (double precision). Used for scientific calculation, coordinates, money (though currency calculations often prefer exact integer arithmetic to avoid floating-point rounding).

- **Boolean:** A true/false value. Typically stored as a single bit in logic, though memory alignment often means one byte is used. The binary foundation of all conditional logic.

- **Character:** A single text character. In C, a char is one byte (ASCII range). In Java and JavaScript, characters are 16-bit to support Unicode.

- **String:** An ordered sequence of characters. In C, a string is simply an array of chars terminated by a null byte. In higher-level languages, strings are objects with associated methods.

- **Null / Undefined / None:** The deliberate absence of a value. Different languages name it differently: null (Java, JS, C#), None (Python), nil (Ruby, Swift). Tony Hoare, who invented null, later called it his 'billion-dollar mistake' due to the null pointer errors it enabled.



## 7.2  Arrays

### What an Array Is

An array stores elements of the same type in contiguous memory locations. The first element is at address X, the second at X + element_size, the third at X + 2 * element_size. This enables O(1) random access: given an index, the address of that element is computed directly.

### Tradeoffs

- **Fast:** Index access O(1), iteration O(n)

- **Slow:** Insertion and deletion in the middle O(n) — all subsequent elements must be shifted

- **Fixed size (in most low-level languages):** must declare size upfront; languages like Python and JavaScript use dynamic arrays (ArrayList/Vector) that resize automatically

### When to Use

When elements need to be accessed by position, when data needs to be iterated linearly, when memory layout matters for cache performance. Arrays are the default data structure for simple ordered collections.



## 7.3  Linked Lists

### What a Linked List Is

A linked list stores elements as nodes, where each node contains a value and a pointer to the next node. Elements are not contiguous in memory — they can be scattered anywhere. The list is traversed by following pointers from one node to the next.

### Variants

- **Singly linked:** Each node points to the next. Can only traverse forward.

- **Doubly linked:** Each node points to the next and previous. Can traverse both directions.

- **Circular:** The last node points back to the first.

### Tradeoffs

- **Fast:** Insertion and deletion at known positions O(1) — just update pointers

- **Slow:** Index access O(n) — must traverse from the head to reach position n

- **Memory overhead:** Every element carries a pointer (8 bytes on 64-bit systems)

### When to Use

When frequent insertions or deletions at arbitrary positions are required and random access is not. Implementing other data structures (stacks, queues). When the maximum size is not known in advance and dynamic resizing must be O(1).



## 7.4  Stack

A stack is a Last-In, First-Out (LIFO) structure. Think of a stack of plates: you can only add to the top (push) or remove from the top (pop). The last item added is the first item removed.

Stacks are fundamental to programming. The call stack — the mechanism that tracks function calls and their local variables — is a stack. When function A calls function B, B's frame is pushed onto the call stack. When B returns, its frame is popped and execution returns to A. Stack overflow occurs when the call stack grows beyond its allocated limit — typically from unbounded recursion.

Use cases: undo/redo systems, expression evaluation, syntax parsing, backtracking algorithms, browser history.



## 7.5  Queue

A queue is a First-In, First-Out (FIFO) structure. Like a queue of people at a counter: the first person to arrive is the first to be served. Elements are added at the back (enqueue) and removed from the front (dequeue).

Use cases: task queues in operating systems and job systems, message queues in distributed systems (Kafka, RabbitMQ), breadth-first graph traversal, print spoolers.

A deque (double-ended queue) allows insertion and removal at both ends. A priority queue processes elements in priority order rather than insertion order — implemented with a heap.



## 7.6  Hash Maps

### What a Hash Map Is

A hash map (also called a dictionary, map, or associative array) stores key-value pairs. Given a key, it retrieves the associated value in O(1) average time — regardless of the number of entries.

### How Hashing Works

A hash function converts a key (a string, number, or any hashable value) into an integer (the hash). This integer is used as an index into an underlying array. To look up a key, hash it, use the hash as an index, and retrieve the value at that array position.

Collisions — two keys producing the same hash — are resolved by chaining (each array slot holds a linked list of entries with the same hash) or open addressing (searching nearby slots for an empty one).

### Tradeoffs

- **Fast:** Lookup, insertion, deletion all O(1) average

- **No order:** Hash maps do not preserve insertion order (though modern implementations like Python 3.7+ and JavaScript Map objects do maintain insertion order)

- **Memory:** Hash maps use more memory than arrays

### When to Use

Counting frequencies, caching previously computed values (memoization), checking membership (is this value in the set?), any situation requiring key-based lookup.



## 7.7  Sets

A set stores unique values with no defined order. Adding a duplicate has no effect. The primary operations are: add, remove, and contains. Membership testing is O(1) — implemented as a hash map with keys but no values.

Use cases: deduplication, set operations (union, intersection, difference), checking whether an element has been visited in a graph traversal.



## 7.8  Trees

### What a Tree Is

A tree is a hierarchical data structure: nodes connected by edges, with a single root node at the top and children nodes branching downward. Each node except the root has exactly one parent. Nodes with no children are leaves.

### Binary Tree

Each node has at most two children (left and right). Binary trees are the foundation for several specialised structures.

### Binary Search Tree (BST)

A binary tree with an ordering property: for every node, all values in its left subtree are smaller, and all values in its right subtree are larger. This enables O(log n) search, insertion, and deletion on average — by halving the search space at each step. Degrades to O(n) if the tree becomes unbalanced (all nodes chained to the right, for instance).

### Balanced Trees (AVL, Red-Black)

Self-balancing BSTs that maintain a balance property after insertions and deletions, guaranteeing O(log n) operations. AVL trees and Red-Black trees are the standard implementations. Java's TreeMap and C++ std::map use Red-Black trees.

### Heap

A tree-based structure with the heap property: in a max-heap, every parent is larger than its children; in a min-heap, every parent is smaller. The root is always the maximum (or minimum) element. Heaps implement priority queues and are used in heap sort.

### Trie

A tree for storing strings where each node represents a character. Common prefixes are shared. Enables O(k) string lookup where k is the string length, regardless of the number of strings stored. Used in autocomplete, spell checkers, and IP routing tables.



## 7.9  Graphs

### What a Graph Is

A graph is a set of nodes (vertices) connected by edges. Unlike a tree, a graph has no root, edges can form cycles, and nodes can have any number of connections in any direction.

### Directed vs Undirected

In an undirected graph, edges have no direction — if A connects to B, then B connects to A. In a directed graph (digraph), edges have direction — A can connect to B without B connecting to A. The web is a directed graph (links point in one direction).

### Weighted Graphs

Edges can carry weights representing costs, distances, or strengths. Weighted graphs model road networks (where edge weight is distance), network bandwidth (where weight is capacity), or recommendation systems (where weight is affinity strength).

### Representation

- **Adjacency matrix:** A 2D array where matrix[i][j] = 1 if node i connects to node j. O(1) edge lookup, O(V^2) space.

- **Adjacency list:** Each node maintains a list of its neighbours. O(V + E) space, more efficient for sparse graphs.

### When to Use

Social networks, road networks, dependency graphs, recommendation systems, web crawling, circuit design. Any system where the relationships between entities are as important as the entities themselves.



## 7.10  Choosing the Right Structure

| Need | Use | Avg Lookup | Notes |
|---|---|---|---|
| Fast index access | Array | O(1) | Fixed size; contiguous memory |
| Frequent insert/delete | Linked List | O(n) | No random access |
| LIFO ordering | Stack | O(1) top | Function call stacks, undo |
| FIFO ordering | Queue | O(1) front | Task queues, BFS |
| Key-value lookup | Hash Map | O(1) avg | Most common lookup structure |
| Uniqueness check | Set | O(1) avg | Backed by hash map |
| Sorted data, range queries | BST/Balanced Tree | O(log n) | In-order traversal gives sorted output |
| Priority ordering | Heap | O(log n) | Used in priority queues |
| Relationship modelling | Graph | O(V+E) | BFS/DFS for traversal |




> **✅ EXIT CHECK — What you should be able to explain before moving on**

- ✓ The difference between primitive types and data structures
- ✓ Why arrays are O(1) for access and O(n) for insertion
- ✓ When to prefer a linked list over an array
- ✓ What LIFO and FIFO mean and which structure implements each
- ✓ How a hash map achieves O(1) lookup and what a collision is
- ✓ What a binary search tree is and what O(log n) means
- ✓ The difference between a tree and a graph
- ✓ Given a problem description, identify the appropriate data structure


---


---



# Chapter 08 — Programming Constructs

*The building blocks of logic*

## Overview

Data structures hold information. Constructs manipulate it. This chapter covers the fundamental mechanisms every programmer uses: functions, control flow, loops, and recursion. These are the vocabulary of logic — the tools from which all algorithms are assembled.



## 8.1  Functions

### What a Function Is

A function is a named, reusable block of code that performs a specific task. It takes zero or more inputs (parameters), executes a set of statements, and optionally returns an output. Functions are the primary mechanism for organising and reusing code.

### Parameters vs Arguments

Parameters are the named placeholders declared in the function definition — the variable names that will hold the inputs. Arguments are the actual values passed when the function is called. The distinction is precise: the function has two parameters; it was called with two arguments.

### Return Values

A function communicates its result back to the caller via a return value. When a return statement is executed, the function terminates and the value is placed where the function call appeared. In statically typed languages, the return type is declared. A function that returns nothing is a void function — it performs an action without producing a value.

### Scope Within Functions

Variables declared inside a function exist only within that function — local scope. They are created when the function is called and destroyed when it returns. Two different function calls produce separate instances of local variables; they do not share state.

### Pure Functions

A pure function always returns the same output for the same input and produces no side effects (does not modify anything outside itself — no global variables, no I/O, no mutations). Pure functions are predictable, testable, and composable. Functional programming, covered in Chapter 10, is built around the principle of preferring pure functions.



## 8.2  Expressions vs Statements

An expression is any piece of code that evaluates to a value. 2 + 3 is an expression (evaluates to 5). myFunction() is an expression if it returns a value. x > y is an expression (evaluates to true or false).

A statement is a complete instruction that does something but does not necessarily produce a value. An if statement, a for loop, a variable declaration — these are statements. The distinction matters because expressions can be nested inside larger expressions; statements cannot.



## 8.3  Operators

### Arithmetic Operators

The standard arithmetic operators: + (addition), - (subtraction), * (multiplication), / (division), % (modulo — the remainder after division), ** (exponentiation in many languages). Division behaviour varies: in integer division (C, Java when both operands are integers), 7/2 = 3 (truncated); in float division, 7/2 = 3.5.

### Comparison Operators

Produce a boolean result by comparing two values: == (equal), != (not equal), < (less than), > (greater than), <= (less than or equal), >= (greater than or equal). In JavaScript, === checks value and type (3 === '3' is false); == checks only value with type coercion (3 == '3' is true). Always use === in JavaScript.

### Logical Operators

Combine boolean values: && (AND — true only if both operands are true), || (OR — true if at least one is true), ! (NOT — inverts the value). Short-circuit evaluation: in a && b, if a is false, b is never evaluated. In a || b, if a is true, b is never evaluated. This is both a performance optimisation and a programming technique.



## 8.4  Conditional Logic

### The If Statement

The fundamental branching construct: if a condition is true, execute one block of code; otherwise, execute a different block (else). The if-else chain allows multiple conditions to be tested in sequence: if this, else if that, else something else. Only one branch executes.

### The Switch Statement

An alternative to long if-else chains when testing a single variable against multiple possible values. More readable for discrete cases (comparing a status code against known values, for instance). Languages differ in whether switch cases fall through to the next case by default (C, JavaScript) or not (Swift, Kotlin).

### The Ternary Operator

A compact expression form of if-else: condition ? value_if_true : value_if_false. Useful for simple conditional assignments. Should be avoided for complex logic where it harms readability.



## 8.5  Loops

### The While Loop

The most fundamental loop: repeatedly execute a block of code while a condition is true. The condition is checked before each iteration. If the condition is false at the start, the loop body never executes. If the condition never becomes false, the loop runs forever (an infinite loop).

### The For Loop

A structured loop with explicit initialisation, condition, and increment: for (let i = 0; i < 10; i++). The three parts make the loop's bounds explicit at a glance. The for loop is the idiomatic choice when iterating a known number of times.

### The For-Each Loop

Iterates over every element in a collection (array, list, set) without managing an index manually. In Python: for item in collection. In JavaScript: for...of. The idiomatic choice for iterating over a collection's elements.

### Break and Continue

break immediately exits the loop regardless of the condition. continue skips the remainder of the current iteration and jumps to the next. Both should be used sparingly — excessive use makes loop logic harder to follow.

### Iterables

An iterable is any data structure that can be traversed element by element. Arrays are iterables. Strings are iterables (each character). In Python, generators are lazy iterables — they produce values on demand rather than holding them all in memory. Custom iterables are defined by implementing the language's iteration protocol.



## 8.6  Recursion

### What Recursion Is

Recursion is when a function calls itself as part of its own execution. Each call creates a new stack frame — a new instance of the function's local variables and execution context — pushed onto the call stack.

### Why Recursion Is Used

Some problems have a natural recursive structure: a tree node contains child nodes that are themselves trees; a directory contains subdirectories that are themselves directories; a sorting algorithm divides a list into sublists and sorts each sublist. Recursion expresses these structures directly and elegantly.

### The Base Case

Every correct recursive function must have a base case — a condition under which the function returns without making another recursive call. Without a base case, the function recurses forever until the call stack overflows.

A factorial function: factorial(5) = 5 * factorial(4) = 5 * 4 * factorial(3) = ... = 5 * 4 * 3 * 2 * 1 * factorial(0). The base case: factorial(0) = 1. At this point recursion stops.

### The Call Stack and Stack Overflow

Each recursive call pushes a new frame onto the call stack. If recursion goes too deep — either through a missing base case or a legitimately deep problem — the call stack exhausts its allocated memory and the program crashes with a stack overflow. The maximum recursion depth varies by language and environment; Python defaults to 1,000 frames.

### Tail Recursion

A recursive call is tail-recursive if it is the last operation in the function — no work remains to be done after the recursive call returns. Some compilers and runtimes optimise tail recursion into iteration (tail call optimisation, or TCO), eliminating the stack frame accumulation. JavaScript engines are required to support TCO by the ES6 specification, though not all do.



## 8.7  Closures

A closure is a function that retains access to variables from its enclosing scope even after that scope has finished executing. When a function is defined inside another function, the inner function closes over the outer function's variables — capturing a reference to them.

Closures are fundamental to functional programming, callback patterns, and module patterns. They are how JavaScript implements private state — a variable in a function's scope is inaccessible from outside, but an inner function can access and expose it in a controlled way.



## 8.8  Higher-Order Functions

A higher-order function is a function that takes another function as an argument, returns a function, or both. This is possible because functions are first-class values in most modern languages — they can be assigned to variables, passed as arguments, and returned.

- **map:** Applies a function to every element of a collection and returns a new collection of the results. [1, 2, 3].map(x => x * 2) produces [2, 4, 6].

- **filter:** Applies a predicate function to each element and returns a new collection containing only elements for which the predicate returned true.

- **reduce:** Accumulates all elements of a collection into a single value by repeatedly applying a combining function. [1, 2, 3, 4].reduce((sum, x) => sum + x, 0) produces 10.

These three operations — map, filter, reduce — can express a remarkably broad range of data transformations declaratively.




> **✅ EXIT CHECK — What you should be able to explain before moving on**

- ✓ What a function is, what parameters vs arguments are, and what a return value is
- ✓ The difference between a statement and an expression
- ✓ How logical operators work and what short-circuit evaluation means
- ✓ The difference between while, for, and for-each loops
- ✓ What recursion is, what a base case is, and what causes a stack overflow
- ✓ What a closure is and how it captures variables from its enclosing scope
- ✓ What a higher-order function is and what map, filter, and reduce do


---


---



# Chapter 09 — Algorithms

*Solving problems systematically*

## Overview

An algorithm is a finite sequence of well-defined steps that solves a problem. Data structures organise information; algorithms transform it. This chapter covers how to evaluate algorithms, and the major design strategies that appear repeatedly across computer science.



## 9.1  What Makes a Good Algorithm

An algorithm must be correct — it must produce the right output for all valid inputs. But beyond correctness, algorithms differ in how efficiently they use time and memory. Two correct algorithms can differ by orders of magnitude in practical performance. Choosing the right algorithm is often the most consequential engineering decision.



## 9.2  Big-O Notation

### What Big-O Measures

Big-O notation describes how an algorithm's resource requirements (time or memory) grow as the input size grows. It expresses the upper bound — the worst case — as a function of the input size n. The constant factors and lower-order terms are dropped, because for large n they become irrelevant.

### Common Complexity Classes

- **O(1) — Constant:** The algorithm takes the same time regardless of input size. Array index access. Hash map lookup.

- **O(log n) — Logarithmic:** The algorithm halves the problem with each step. Binary search, balanced BST operations. Grows very slowly — log2(1,000,000) ≈ 20.

- **O(n) — Linear:** The algorithm's time grows proportionally to input size. Iterating an array. Finding an element in an unsorted list.

- **O(n log n) — Linearithmic:** The most efficient class for comparison-based sorting. Merge sort, heap sort, quicksort (average).

- **O(n^2) — Quadratic:** Nested iteration over the input. Bubble sort, selection sort. Becomes impractical for large inputs.

- **O(2^n) — Exponential:** Solving all subsets of the input. Brute-force password cracking, naive recursive Fibonacci. Practical only for very small inputs.

- **O(n!) — Factorial:** Generating all permutations. The naive travelling salesman solution. Completely impractical beyond ~15 elements.

### Time vs Space Complexity

Big-O applies to both time (how long it runs) and space (how much memory it uses). An algorithm might be O(n) time but O(1) space (processes one element at a time), or O(n) time and O(n) space (stores a transformed copy of the input). Sometimes time and space trade off: using more memory can enable faster computation.



## 9.3  Brute Force

The simplest algorithm design strategy: try every possible solution and select the one that works. Correctness is trivially guaranteed; efficiency is not.

Checking every 4-digit PIN from 0000 to 9999 is brute force — 10,000 attempts, O(10^4). Checking all subsets of a set of n items is O(2^n). For small inputs, brute force is entirely reasonable. For large inputs, it is practically useless — but it provides a correct baseline against which more sophisticated algorithms can be verified.



## 9.4  Divide and Conquer

Divide the problem into smaller subproblems, solve each subproblem recursively, and combine the results. The power comes from the observation that O(n log n) algorithms — far faster than O(n^2) — are often achievable by dividing and merging.

### Binary Search

Find a target value in a sorted array. Compare the target to the middle element. If equal, done. If smaller, search the left half. If larger, search the right half. Each comparison eliminates half the remaining elements. Result: O(log n) — finding one value in one billion sorted entries requires at most 30 comparisons.

### Merge Sort

Sort an array by recursively splitting it in half, sorting each half, then merging the two sorted halves. The merge step compares front elements of both halves and builds the sorted output. Time: O(n log n). Space: O(n) for the merge buffer. Stable sort (preserves original order of equal elements).

### Quicksort

Pick a pivot element. Partition: move all elements smaller than the pivot to its left, all larger to its right. Recursively sort both sides. Average O(n log n), worst case O(n^2) (when the pivot is always the smallest or largest element). In practice, quicksort with good pivot selection outperforms merge sort due to cache efficiency.



## 9.5  Dynamic Programming

### The Core Insight

Many problems involve solving overlapping subproblems — the same smaller problem is encountered multiple times in different recursive branches. Dynamic programming solves each subproblem once, stores the result (memoization), and reuses it instead of recomputing.

### Memoization

Top-down approach: write the naive recursive solution, but cache the result of each subproblem. Before computing, check if the result is already cached. This transforms an exponential algorithm into polynomial time for problems with overlapping subproblems.

The classic example: naive recursive Fibonacci is O(2^n). With memoization, Fibonacci is O(n) — each of the n values is computed exactly once.

### Tabulation

Bottom-up approach: instead of computing top-down with recursion, compute subproblems from the smallest upward, building a table of results. Often more cache-efficient than memoization.

### When to Use DP

Problems with optimal substructure (the optimal solution to the whole problem can be constructed from optimal solutions to subproblems) and overlapping subproblems. Common DP problems: shortest paths, sequence alignment (bioinformatics), knapsack problem, edit distance between strings.



## 9.6  Greedy Algorithms

At each step, make the locally optimal choice — the one that looks best right now — without reconsidering past decisions or evaluating future consequences. Greedy algorithms are efficient and simple, but do not always produce the globally optimal solution.

### When Greedy Works

Greedy algorithms produce globally optimal solutions for problems with the greedy choice property — making the locally optimal choice at each step leads to the globally optimal solution. Dijkstra's shortest path algorithm is greedy and provably optimal for non-negative edge weights. Huffman coding (data compression) is greedy and provably optimal.

### When Greedy Fails

The coin change problem illustrates failure: with coins of values 1, 3, and 4, making change for 6 cents. A greedy algorithm picks the largest coin: 4 then 1, 1 — three coins. The optimal solution is two 3-cent coins. When greedy fails, dynamic programming typically provides the correct solution.



## 9.7  Backtracking

Build a solution incrementally. At each step, extend the current partial solution. If extending becomes impossible (no valid move exists) or the partial solution violates constraints, backtrack — undo the last choice and try an alternative.

Backtracking is essentially a systematic search of all possible solutions, pruning branches that cannot lead to a valid solution. It is more efficient than brute force when the constraint pruning eliminates large parts of the search space.

Classic backtracking problems: the N-queens problem (placing N chess queens on an N x N board so no two threaten each other), Sudoku solving, maze solving. Graph problems like finding a Hamiltonian cycle are also solved by backtracking.



## 9.8  Graph Traversal

### Breadth-First Search (BFS)

Explore a graph layer by layer. Start at a node, visit all its immediate neighbours, then all their unvisited neighbours, and so on. Uses a queue. BFS finds the shortest path (in terms of number of edges) between two nodes in an unweighted graph.

### Depth-First Search (DFS)

Explore as deep as possible along each branch before backtracking. Uses a stack (or recursion). DFS is used to detect cycles, determine connectivity, and as the basis for many other graph algorithms.

### Dijkstra's Algorithm

Find the shortest path in a weighted graph. Uses a priority queue. Greedy: always expand the unvisited node with the smallest known distance. Produces the optimal shortest path from a source to all other reachable nodes. Does not work with negative edge weights (requires Bellman-Ford for that).



## 9.9  Sorting Algorithms

Sorting is the most studied problem in computer science — every major technique in algorithm design has been applied to it.

- **Bubble sort:** O(n^2). Compare adjacent elements, swap if out of order, repeat until no swaps needed. Simple to implement; only used for teaching.

- **Selection sort:** O(n^2). Find the minimum of the unsorted portion, place it at the start. Simple; marginally better than bubble in practice.

- **Insertion sort:** O(n^2) worst case, O(n) for nearly sorted data. Insert each element into its correct position in the sorted portion. Excellent for small or nearly sorted arrays.

- **Merge sort:** O(n log n) guaranteed. Divide and conquer. Stable. Preferred when stability matters.

- **Quicksort:** O(n log n) average, O(n^2) worst case. In-place. The standard sort implementation in many languages.

- **Heap sort:** O(n log n) guaranteed. In-place. Less cache-friendly than quicksort; rarely used in practice but theoretically attractive.

- **Counting sort / Radix sort:** O(n) for integer keys within a bounded range. Non-comparison-based. Used when input characteristics allow it.




> **✅ EXIT CHECK — What you should be able to explain before moving on**

- ✓ What Big-O notation measures and why constants are dropped
- ✓ The complexity classes O(1), O(log n), O(n), O(n log n), O(n^2) — and examples of each
- ✓ Why binary search is O(log n) — explained in words, not formula
- ✓ What dynamic programming is and what memoization means
- ✓ When greedy algorithms work and when they fail
- ✓ What backtracking is and what 'pruning' means
- ✓ The difference between BFS and DFS and when each is preferred
- ✓ Why O(n log n) is the theoretical minimum for comparison-based sorting


---


---



# Chapter 10 — Programming Paradigms

*The philosophies behind how code is organised*

## Overview

Two programs can solve the same problem correctly and yet be structured in completely different ways — one organised around objects that model the real world, another around pure functions that transform data, another around explicit step-by-step instructions. These are not just stylistic differences; they reflect fundamentally different philosophies about what a program is and how it should be written. This chapter explains those philosophies.



## 10.1  What a Paradigm Is

A programming paradigm is a style or approach to programming — a set of principles and patterns that guide how programs are structured. A paradigm is not a language. Most modern languages are multi-paradigm: they support elements of several paradigms simultaneously. A paradigm is a way of thinking, not a constraint imposed by syntax.



## 10.2  Imperative Programming

The oldest and most direct paradigm: a program is a sequence of commands that tell the machine exactly what to do, step by step, in what order. The programmer specifies the control flow explicitly.

Imperative programs change state — variables are assigned and reassigned as the program progresses. The execution model mirrors the fetch-decode-execute cycle of the CPU: one instruction at a time, in sequence.

All assembly language is imperative. Most C code is imperative. An imperative solution to 'sum the numbers in an array' would initialise a sum variable, loop through each element, and add each to the sum in sequence.



## 10.3  Procedural Programming

Procedural programming is imperative programming organised into procedures (functions). Rather than a single flat sequence of statements, the program is divided into named, reusable procedures that can be called from multiple places.

C is the canonical procedural language. Programs are collections of functions; there are no classes or objects. Data is separate from the functions that manipulate it.

Procedural programming introduced the major improvements over unstructured imperative code: reusability through functions, reduced duplication, and improved readability through meaningful function names. Most code ever written is procedural at heart.



## 10.4  Object-Oriented Programming (OOP)

### The Core Idea

OOP organises programs around objects — entities that bundle state (data) and behaviour (functions) together. The world is modelled as interacting objects rather than as procedures acting on separate data.

### Classes and Objects

A class is a blueprint — a definition of what properties (data) and methods (functions) an object will have. An object is an instance of a class — a specific, concrete entity created from that blueprint. A class defines 'what a bank account is'; an object is 'this specific bank account with balance $1,500'.

### The Four Pillars

- **Encapsulation:** Bundling data and methods together, and restricting direct access to internal state. The object exposes a public interface (methods) and hides its implementation details. External code interacts through the interface, not by reaching in and modifying the data directly. This makes the object's internals changeable without breaking external code.

- **Abstraction:** Exposing only what is necessary. The user of an object needs to know what it can do (the interface), not how it does it (the implementation). Abstraction reduces cognitive load and coupling.

- **Inheritance:** A class can inherit properties and methods from a parent class, extending or overriding them. A Dog class might inherit from an Animal class, sharing the eat() method while overriding the speak() method. Inheritance enables code reuse and creates class hierarchies. However, deep inheritance hierarchies are widely considered a design smell — 'composition over inheritance' is a frequent modern recommendation.

- **Polymorphism:** Different types can be treated uniformly through a shared interface. A function that accepts an Animal can receive a Dog, a Cat, or any other Animal subclass — and each will behave appropriately according to its own speak() implementation. Polymorphism eliminates the need for explicit type-checking.

### Design Patterns

Design patterns are named, reusable solutions to commonly recurring design problems. They were popularised by the 'Gang of Four' book (Gamma, Helm, Johnson, Vlissides, 1994). Patterns include: Singleton (ensure a class has only one instance), Factory (create objects without specifying their exact type), Observer (notify dependents when state changes), Strategy (define a family of algorithms, encapsulate each one, make them interchangeable).

Patterns are not code to be copied; they are templates for structuring relationships between classes. Knowing patterns allows a programmer to communicate design intent efficiently.

### Criticism of OOP

OOP has been dominant for decades but faces thoughtful criticism. Shared mutable state — objects modifying each other's state — is a major source of bugs, especially in concurrent programs. Deep inheritance hierarchies can create fragile, tightly coupled code. The mapping of the real world onto objects is often forced and arbitrary. These criticisms have driven growing interest in functional programming.



## 10.5  Functional Programming

### The Core Idea

Functional programming treats computation as the evaluation of mathematical functions. Programs are built from pure functions — functions with no side effects that always return the same output for the same input. State mutation is avoided or eliminated.

### Immutability

Rather than modifying existing data, functional programs create new data. Instead of changing an array by pushing an element, a new array is created with the element added. This seems wasteful but enables powerful properties: no function can unexpectedly change data another function is using; the history of data transformations is preserved; concurrent code becomes safe because there is nothing to mutate.

### First-Class and Higher-Order Functions

Functions are values. They can be passed as arguments, returned from other functions, stored in variables. This enables higher-order functions (map, filter, reduce), function composition (building complex operations by chaining simpler ones), and currying (transforming a function of multiple arguments into a sequence of functions of one argument each).

### Referential Transparency

An expression is referentially transparent if it can be replaced by its value without changing the program's behaviour. Pure functions are referentially transparent. This property makes programs easier to reason about, test, and optimise (a compiler can safely cache the result of a referentially transparent expression).

### Functional Languages and Influence

Haskell is the most purely functional major language — a program is essentially one big expression. Clojure, Erlang, and Elixir are functional with immutable data. Scala, F#, and OCaml blend functional and OOP. JavaScript, Python, Kotlin, Swift, and Rust all support functional style as one of multiple options. Even Java added lambda expressions and streams.



## 10.6  Declarative Programming

Declarative programming describes what should be computed, not how to compute it. The programmer specifies the desired outcome; the runtime or engine determines the steps to achieve it.

SQL is declarative: SELECT * FROM users WHERE age > 18 ORDER BY name describes the desired result without specifying how the database should retrieve it. HTML is declarative: the browser decides how to render the structure. React's JSX is declarative: the developer describes what the UI should look like; React determines the minimum DOM operations required.

Declarative code is typically shorter and more readable than equivalent imperative code, at the cost of giving up fine-grained control over execution.



## 10.7  Multi-Paradigm Languages

Most modern general-purpose languages are multi-paradigm. JavaScript supports procedural, functional (first-class functions, closures, immutability patterns), object-oriented (classes, prototypal inheritance), and declarative (React, functional array methods) programming simultaneously. Python supports all of the above. Kotlin, Swift, and TypeScript do as well.

This is not a weakness — it is a strength. Real software problems do not fit neatly into one paradigm. A well-structured application might use OOP to model its domain entities, functional transformations to process data, declarative JSX to describe the UI, and imperative control flow where it is the clearest approach.




> **✅ EXIT CHECK — What you should be able to explain before moving on**

- ✓ The difference between imperative and declarative programming
- ✓ What procedural programming adds over unstructured imperative code
- ✓ The four pillars of OOP — encapsulation, abstraction, inheritance, polymorphism
- ✓ What a design pattern is and why patterns are not code
- ✓ What makes a function 'pure' and why purity matters
- ✓ What immutability means in functional programming and what it enables
- ✓ Why most modern languages are multi-paradigm and why that is appropriate


---


---



# Chapter 11 — Concurrency

*Doing more than one thing at a time*

## Overview

A sequential program does one thing at a time, in order. But real software — a web server handling thousands of requests, a mobile app downloading data while the UI remains responsive, a database processing simultaneous transactions — cannot afford to wait for one operation to complete before starting the next. Concurrency is the set of techniques for managing this.



## 11.1  Concurrency vs Parallelism

### The Distinction

These terms are frequently confused, even by experienced developers.

Parallelism means doing multiple things simultaneously — two calculations running at the same instant on two different CPU cores. True parallelism requires multiple execution units.

Concurrency means managing multiple tasks that may be in progress simultaneously — making progress on one task, then another, then back to the first, even on a single core. The tasks overlap in time but do not necessarily execute at the same instant.

A single-core CPU can be concurrent but not parallel. A multi-core CPU can be both. Concurrency is a design property of a program; parallelism is a property of execution.



## 11.2  Processes and Threads Revisited

Chapter 4 introduced processes and threads from the OS perspective. Here they are revisited from the programmer's perspective.

A process is the fundamental unit of isolation. It has its own memory space, file handles, and resources. Creating a process is expensive. Communicating between processes requires explicit mechanisms (pipes, sockets, shared memory).

A thread is the fundamental unit of execution within a process. Threads share the process's memory — any thread can read or write any variable in the process's heap. Creating a thread is cheap. Communication between threads is trivial but dangerous: shared memory is the source of most concurrency bugs.



## 11.3  Synchronous vs Asynchronous

Synchronous code executes sequentially — each statement completes before the next begins. If a statement involves waiting (for a network response, for a file to be read), the entire thread waits. Blocking the thread means no other code on that thread can run.

Asynchronous code initiates an operation and continues executing without waiting for it to complete. When the operation finishes, a callback, promise, or coroutine resumes the original context. The thread is free to do other work while the operation is in progress.

For I/O-bound work — waiting for network responses, disk reads, timers — asynchronous code achieves much better throughput than synchronous code. For CPU-bound work — heavy computation — asynchronous code helps less; the CPU is busy, not waiting.



## 11.4  Callbacks

The earliest asynchronous pattern: pass a function (the callback) to an asynchronous operation. When the operation completes, it calls the callback with the result. Node.js was built on this model.

Callbacks work but compose poorly. When multiple asynchronous operations depend on each other — the result of operation A must be passed to operation B, and B's result to C — callbacks nest inside each other, creating deeply indented code known as 'callback hell'. Error handling is complex and easy to omit.



## 11.5  Promises

A promise represents the eventual result of an asynchronous operation — a value that is not yet available but will be. A promise can be in one of three states: pending (operation in progress), fulfilled (operation succeeded, value available), or rejected (operation failed, error available).

Promises are chainable via .then() — the return value of one .then() handler becomes the input to the next. Error handling is centralised in a .catch() at the end of the chain. This transforms nested callbacks into a linear sequence of steps.



## 11.6  Async/Await

Async/await is syntactic sugar over promises that makes asynchronous code look synchronous. A function marked async always returns a promise. Within an async function, await pauses execution and waits for a promise to settle before continuing — but crucially, the thread is not blocked; other code can run while waiting.

Error handling uses standard try/catch blocks rather than .catch() chains. Async/await is the modern standard for asynchronous JavaScript and TypeScript.



## 11.7  The Event Loop

### JavaScript's Concurrency Model

JavaScript is single-threaded — it has one call stack and executes one thing at a time. Yet JavaScript handles asynchronous operations (network requests, timers, user events) without blocking. This is the event loop's job.

### How the Event Loop Works

- **Call stack:** The currently executing code. JavaScript pushes function calls onto the stack and pops them when they return.

- **Web APIs / Node APIs:** Asynchronous operations (setTimeout, fetch, file reads) are handed off to the runtime environment, which handles them outside the call stack. When they complete, they place their callbacks in the callback queue.

- **Callback queue:** A queue of callbacks waiting to be executed.

- **Event loop:** Continuously checks: is the call stack empty? If yes, take the first callback from the queue and push it onto the stack. If no, wait.

This means JavaScript callbacks only run when the call stack is completely empty. A long-running synchronous operation blocks the event loop — no callbacks execute, the UI freezes. This is why 'never block the event loop' is a fundamental JavaScript performance principle.

### Microtask Queue

Promises use a separate microtask queue (also called the job queue) that is processed before the callback queue after every call stack emptying. This means promise callbacks (.then() handlers) run before setTimeout callbacks, even if the setTimeout was scheduled first.



## 11.8  Coroutines

Coroutines are functions that can be paused and resumed. Unlike a regular function that runs to completion, a coroutine can yield control at a specific point, allow other code to run, and be resumed later from where it left off.

Python's async/await is built on coroutines. Kotlin coroutines provide a rich concurrency framework. Go's goroutines are lightweight threads managed by the Go runtime. These all achieve concurrent execution without the overhead of OS threads.



## 11.9  Race Conditions

### What a Race Condition Is

A race condition occurs when the behaviour of a program depends on the relative timing of events — specifically, when multiple concurrent operations access shared state and the outcome depends on which operation completes first. The result is non-deterministic: the same code may produce different results on different runs.

### Examples

Two threads simultaneously read a counter variable (value: 5), both add 1, and both write back. Both write 6. The counter should be 7 but is 6 — one increment was lost. In JavaScript, a user rapidly navigates between profiles triggers two network requests for different profiles. The second request completes before the first. The first request's result overwrites the second — the displayed profile is wrong.

### Solutions

- **Atomic operations:** Single, indivisible operations that cannot be interrupted. Many CPUs provide atomic increment instructions.

- **Locks/mutexes:** A lock ensures only one thread can access a critical section at a time. The first thread to acquire the lock proceeds; others wait. Risk: deadlock (two threads each hold a lock the other needs, both waiting forever).

- **AbortController (web):** Cancel an in-flight network request when it is no longer needed — when a new request supersedes it.

- **Immutable data:** If data cannot be modified, multiple threads can read it simultaneously without conflict.

- **Message passing:** Instead of sharing memory, threads communicate by sending messages (Go channels, Erlang actors). No shared state means no races.



## 11.10  Deadlocks

A deadlock occurs when two or more threads are each waiting for a resource held by the other. Thread A holds lock 1 and waits for lock 2. Thread B holds lock 2 and waits for lock 1. Both wait forever. The system is stuck.

Prevention strategies: always acquire locks in the same order across all threads; use timeout-based lock acquisition; avoid holding multiple locks simultaneously; use higher-level concurrency primitives (like transaction systems) that handle locking internally.



## 11.11  Concurrency in Different Languages

- **JavaScript:** Single-threaded event loop. Concurrency through async/await. True parallelism through Web Workers (browser) or Worker Threads (Node.js).

- **Python:** Global Interpreter Lock (GIL) prevents true multi-threaded parallelism for CPU-bound work. AsyncIO for asynchronous I/O. Multiprocessing module for parallelism (separate processes, no GIL).

- **Go:** Goroutines — lightweight, managed by the Go runtime, spawning thousands is practical. Channels for communication. Built around concurrent design.

- **Rust:** Ownership model extends to threads — the borrow checker prevents data races at compile time. Thread-safe primitives like Arc<Mutex<T>>.

- **Java/Kotlin:** Thread-based concurrency with Java's concurrency utilities. Kotlin coroutines for async. Project Loom brings virtual threads (lightweight like goroutines) to the JVM.




> **✅ EXIT CHECK — What you should be able to explain before moving on**

- ✓ The precise difference between concurrency and parallelism
- ✓ Why asynchronous code is preferred for I/O-bound work
- ✓ How the JavaScript event loop works — the call stack, queue, and event loop steps
- ✓ What async/await is and what it is built on top of
- ✓ What a race condition is, how to create one accidentally, and three ways to prevent it
- ✓ What a deadlock is and why it occurs
- ✓ How concurrency is handled differently in JavaScript vs Go vs Rust


---


---



# Chapter 12 — Databases

*Persisting, organising, and querying data*

## Overview

Almost every application needs to store data that persists beyond a single session — user accounts, messages, transactions, content. Storing data reliably, retrieving it efficiently, and maintaining its integrity under concurrent access and partial failures are the problems databases solve.



## 12.1  What a Database Is

A database is an organised collection of structured data, along with software (the Database Management System, or DBMS) that manages storage, retrieval, and access control. The DBMS provides a query interface — a language or API for reading and writing data — and handles the complexity of physical storage, indexing, concurrency, and durability.

Storing data in flat files — one record per line in a text file — works for tiny datasets but fails at scale: there is no efficient way to search, no protection against concurrent writes corrupting data, no mechanism for transactions. Databases are the solution.



## 12.2  Relational Databases

### The Model

Relational databases organise data into tables. Each table has a schema — a definition of its columns, their names, and their types. Each row in a table is a record. Tables can be related to each other through foreign keys — a column in one table that references the primary key of another.

This model, proposed by Edgar Codd in 1970, is the foundation of every relational database. Its power comes from the ability to query data across multiple related tables and express complex relationships.

### SQL

Structured Query Language is the standardised language for querying and manipulating relational databases. It is declarative — the query describes the desired data, not the steps to retrieve it.

- **SELECT:** Retrieve data. SELECT name, email FROM users WHERE age > 18 ORDER BY name LIMIT 10.

- **INSERT:** Add new rows. INSERT INTO users (name, email) VALUES ('Alice', 'alice@example.com').

- **UPDATE:** Modify existing rows. UPDATE users SET email = 'new@example.com' WHERE id = 42.

- **DELETE:** Remove rows. DELETE FROM users WHERE id = 42.

- **JOIN:** Combine rows from multiple tables based on a related column. SELECT orders.id, users.name FROM orders JOIN users ON orders.user_id = users.id.

### Popular Relational Databases

PostgreSQL: the most capable open-source relational database. Feature-rich, extensible, excellent for production use. MySQL/MariaDB: widely deployed, especially in web hosting. SQLite: a serverless, file-based relational database — the entire database is one file. Used in mobile apps (iOS, Android use SQLite internally), desktop apps, and testing. Microsoft SQL Server: dominant in enterprise and .NET environments.



## 12.3  ACID Properties

### Why ACID Matters

A database must handle failures (power loss, crashes) and concurrent access (many users reading and writing simultaneously) without corrupting data. ACID is the set of properties that guarantee correct behaviour.

- **Atomicity:** A transaction either completes entirely or has no effect. If a bank transfer involves debiting one account and crediting another, both operations succeed or neither does — there is no state where one has happened and the other has not.

- **Consistency:** A transaction brings the database from one valid state to another valid state. Defined constraints (e.g. account balance cannot be negative) are always maintained.

- **Isolation:** Concurrent transactions execute as if they were sequential. One transaction cannot see the intermediate state of another.

- **Durability:** Once a transaction is committed, it persists even if the system immediately crashes. Committed data is written to non-volatile storage.



## 12.4  Indexes

### The Problem

A full table scan — reading every row to find matches — is O(n). For a table with 100 million rows, searching for a single user by email would require reading all 100 million rows.

### What an Index Does

An index is a separate data structure (typically a B-tree) built on one or more columns of a table. It maps column values to the physical locations of the corresponding rows. With an index on email, finding a user by email is O(log n) — the database traverses the B-tree rather than scanning the table.

### The Tradeoff

Indexes speed up reads but slow down writes. Every INSERT, UPDATE, or DELETE must also update all relevant indexes. Indexes consume disk space. Adding an index to every column is counterproductive — the overhead of maintaining many indexes may exceed the query speed gained. Index design is a critical performance optimisation skill.



## 12.5  Transactions

A transaction is a sequence of database operations treated as a single unit. It begins with BEGIN, ends with COMMIT (apply all changes) or ROLLBACK (undo all changes). The ACID properties guarantee that transactions either fully succeed or leave no trace of their attempted changes.

Transactions are essential for any operation involving multiple related changes: transferring money, processing an order (deduct stock AND record order AND charge payment), migrating data. Without transactions, a crash midway through leaves data in an inconsistent state.



## 12.6  Non-Relational Databases (NoSQL)

### Why NoSQL Emerged

Relational databases, with their rigid schemas and strong consistency, face challenges at very large scale and for certain data shapes. In the 2000s, companies building applications at unprecedented scale (Google, Amazon, Facebook) developed alternative database systems optimised for their specific needs. These were collectively labelled NoSQL.

### Document Databases

Store data as JSON-like documents rather than rows. Each document can have different fields. Schema-less (or schema-flexible) — documents in the same collection need not have identical structure. Natural fit for hierarchical data that maps to objects in code. MongoDB is the dominant document database. Firestore (Firebase) is a popular hosted document database.

### Key-Value Stores

The simplest model: a dictionary at scale. Look up any value by its key. Extremely fast for simple reads and writes. Cannot query by value — only by key. Redis is the dominant key-value store, also used as an in-memory cache and message queue.

### Column-Family Databases

Data is stored in columns rather than rows, optimised for queries that read specific columns across many rows (common in analytics). Apache Cassandra and HBase are examples. Used for large-scale, write-heavy workloads.

### Graph Databases

Store data as nodes and edges, optimised for traversing relationships. Querying 'friends of friends within 3 hops' is a natural graph query that is awkward in relational databases. Neo4j is the dominant graph database. Used for social networks, recommendation engines, fraud detection.

### The CAP Theorem

In a distributed database (one spread across multiple machines), it is impossible to simultaneously guarantee: Consistency (all nodes see the same data at the same time), Availability (every request receives a response), and Partition tolerance (the system continues operating if network partitions isolate some nodes). Any distributed database must trade off between these properties. NoSQL databases often trade strict consistency for availability and partition tolerance.



## 12.7  Schema Design

A schema is the formal definition of a database's structure: its tables (or collections), columns (or fields), types, constraints, and relationships. Schema design is the process of deciding how to represent data to satisfy the application's query patterns efficiently.

### Normalisation

Normalisation is the process of structuring a relational database to reduce redundancy. Rather than storing a user's name in every order record, store the user once in a users table and reference them by ID in the orders table. The First through Third Normal Forms (1NF, 2NF, 3NF) define increasingly strict rules for eliminating redundancy.

### Denormalisation

Sometimes strategic redundancy improves read performance. If a query frequently joins three tables to get a result, storing that result in a pre-computed column (denormalisation) eliminates the join overhead. This is a deliberate tradeoff: write complexity and storage cost in exchange for read speed.



## 12.8  The N+1 Problem

A classic database performance pitfall. If fetching a list of 100 users and then, for each user, issuing a separate query to fetch their latest order, the result is 1 (fetch users) + 100 (fetch each order) = 101 queries — an N+1 pattern. Solutions: eager loading (JOIN to fetch users and their orders in a single query), data loaders (batch multiple lookups into one query), or query optimisation at the ORM level.




> **✅ EXIT CHECK — What you should be able to explain before moving on**

- ✓ What a database provides that a flat file does not
- ✓ What a relational database's table and schema are
- ✓ The four ACID properties and what each means for data integrity
- ✓ What a SQL JOIN does and why it exists
- ✓ What a database index is, how it works, and its tradeoff
- ✓ What a transaction is and what ROLLBACK does
- ✓ The difference between relational and document databases — when each is appropriate
- ✓ What the CAP theorem states about distributed databases


---


---



# Chapter 13 — Security

*Protecting systems and the data they hold*

## Overview

Software that handles real data — user accounts, financial transactions, private messages — carries a responsibility to protect that data. Security is not a feature to add at the end; it is a discipline that must be built into every layer from the start. This chapter covers the foundational concepts that every developer must understand.



## 13.1  The Threat Model

Security engineering begins with a threat model: who might attack this system, what would they want, and how might they try to get it? Without a threat model, security measures are applied randomly. With one, limited resources are focused on the most likely and most damaging attacks.

Common threat categories: data exfiltration (stealing data), unauthorised access (accessing accounts or resources without permission), denial of service (preventing legitimate users from accessing the service), data manipulation (corrupting or altering data), and impersonation (pretending to be a legitimate user or service).



## 13.2  Encryption

### What Encryption Is

Encryption transforms data into an unreadable form (ciphertext) using a mathematical algorithm and a key. Only those with the correct key can decrypt and read the data. Encryption protects data in transit (over a network) and at rest (stored on disk).

### Symmetric Encryption

The same key is used to encrypt and decrypt. Fast and efficient — suitable for encrypting large amounts of data. The challenge: securely distributing the key. If an attacker intercepts the key exchange, all encrypted communication is compromised. AES (Advanced Encryption Standard) with 256-bit keys is the standard symmetric cipher.

### Asymmetric Encryption

Uses a key pair: a public key (which anyone can know) and a private key (which must remain secret). Data encrypted with the public key can only be decrypted with the private key. Data signed with the private key can be verified by anyone with the public key.

This solves the key distribution problem: share the public key freely; keep the private key secret. Two parties can establish encrypted communication without having previously shared a secret. RSA and elliptic curve cryptography (ECC) are the dominant asymmetric algorithms.

### TLS in Practice

TLS (covered in Chapter 5) uses asymmetric cryptography to establish a shared symmetric key. The slow, computationally expensive asymmetric step is done once at handshake time to securely agree on a symmetric key; all subsequent data is encrypted with the fast symmetric key. This hybrid approach provides both security and performance.



## 13.3  Hashing

### What Hashing Is

A hash function takes an input of any size and produces a fixed-size output (the hash or digest). Hash functions are one-way: given a hash, it is computationally infeasible to determine the input. The same input always produces the same hash. Different inputs should produce different hashes (collision resistance).

### Why Passwords Are Hashed, Not Encrypted

If a database stores passwords encrypted, a breach that also exposes the encryption key means every password is compromised. Hashing eliminates this problem: store the hash of the password, not the password itself. During login, hash the entered password and compare it to the stored hash. The original password is never stored.

### Password Hashing vs Data Hashing

MD5 and SHA-1 are fast hash functions used for data integrity checks (verifying a file has not been corrupted). They are not suitable for passwords — an attacker can precompute hashes of millions of common passwords and compare them to stolen hashes (a rainbow table attack).

Password hashing algorithms — bcrypt, scrypt, Argon2 — are deliberately slow and incorporate a salt (a random value added to each password before hashing, so that two users with the same password have different hashes). This makes brute-force attacks computationally expensive.



## 13.4  Authentication vs Authorisation

### Authentication

Authentication answers: who are you? It is the process of verifying identity. A user provides credentials (password, biometric, hardware token); the system verifies them and establishes an authenticated session.

### Authorisation

Authorisation answers: what are you allowed to do? After authentication establishes identity, authorisation determines what resources and actions that identity can access. A logged-in user might be authorised to view their own profile but not others'; an admin might be authorised to view all profiles.

Authentication without authorisation is a door that verifies who you are but lets you access everything. Authorisation without authentication is a door that restricts access but doesn't know who is trying to enter. Both are necessary.



## 13.5  Sessions and Tokens

### Session-Based Authentication

After login, the server creates a session — a record of the authenticated user — and stores it server-side (in memory, a database, or a cache). A session ID is sent to the client (typically in a cookie). On subsequent requests, the client sends the session ID; the server looks it up and identifies the user.

### Token-Based Authentication (JWT)

A JSON Web Token (JWT) is a signed, self-contained token containing claims about the user (user ID, roles, expiration time). The server signs the token with its private key. The client stores the token (typically in memory or a cookie) and sends it with each request. The server verifies the signature — no database lookup required.

JWTs are stateless: the server does not need to store session state. This scales well for distributed systems. The tradeoff: revoking a JWT before it expires is difficult — the server cannot 'forget' it the way it can delete a session. Short expiration times and refresh token patterns mitigate this.



## 13.6  Common Attack Vectors

### SQL Injection

If user-supplied input is directly concatenated into a SQL query, an attacker can manipulate the query. The input ' OR '1'='1 in a password field might turn SELECT * FROM users WHERE password='...' into a query that always returns true, granting access without a valid password. Defence: parameterised queries (prepared statements) — never concatenate user input into SQL.

### Cross-Site Scripting (XSS)

An attacker injects malicious JavaScript into a web page viewed by other users. If a forum allows unescaped HTML in posts, an attacker can post a script that steals cookies or redirects users. Defence: escape all user-supplied content before rendering it as HTML; use Content Security Policy headers.

### Cross-Site Request Forgery (CSRF)

An attacker tricks a user's browser into making an authenticated request to a site where the user is logged in. Since the browser automatically sends cookies, the request appears legitimate. Defence: CSRF tokens (a unique token in each form that the server verifies); SameSite cookie attribute; checking the Origin header.

### Man-in-the-Middle (MITM)

An attacker positions themselves between client and server, intercepting and potentially modifying communications. HTTPS with TLS prevents this — the TLS certificate authenticates the server and the encrypted channel prevents interception.

### Dependency Vulnerabilities

Modern software uses hundreds of third-party packages. A vulnerability in any dependency is a potential attack surface. Tools like npm audit, Snyk, and Dependabot scan dependencies for known vulnerabilities and suggest updates.



## 13.7  The Principle of Least Privilege

Every component of a system — user, process, service, database connection — should have access only to what it strictly needs to perform its function. A web application's database connection should not have permission to drop tables. An API key for reading analytics should not have permission to write. A user account should not have admin privileges it does not need.

Least privilege limits the blast radius of a breach: if an attacker compromises a limited-privilege component, the damage is bounded. It also reduces the risk of bugs causing unintended data loss or corruption.




> **✅ EXIT CHECK — What you should be able to explain before moving on**

- ✓ The difference between symmetric and asymmetric encryption
- ✓ Why passwords are hashed rather than encrypted
- ✓ What a salt is and why bcrypt is preferred over SHA-256 for passwords
- ✓ The difference between authentication and authorisation
- ✓ The difference between session-based and JWT-based auth
- ✓ What SQL injection is and how parameterised queries prevent it
- ✓ What XSS is and how escaping prevents it
- ✓ What the principle of least privilege means and why it matters


---


---



# Chapter 14 — The Build Process

*From source code to shipped product*

## Overview

Writing code is one thing. Getting that code from a developer's machine to a running production system that users can access is another — a multi-step process involving compilation, testing, packaging, and deployment. This chapter traces that entire journey.



## 14.1  Source Code

Source code is text. Before any build process runs, a project is simply a collection of text files in a directory. The build process transforms these files into something that can run — on a server, in a browser, or on a device.

A .gitignore file specifies which files should not be tracked by version control: node_modules (installed dependencies, reproducible from package.json), .env files (contain secrets), build output (generated, not authored). The source code repository should contain only what a developer authored; everything else is either installed, generated, or secret.



## 14.2  Package Management and Dependencies

### What a Package Manager Does

Almost no program is written entirely from scratch. It uses libraries — code written and maintained by others. A package manager automates the process of finding, downloading, installing, and versioning these dependencies.

- **npm (Node Package Manager):** The package manager for JavaScript and TypeScript. npm install reads package.json and installs all listed dependencies into node_modules. npm install [package] adds a new dependency.

- **pip:** Python's package manager. pip install installs packages from PyPI.

- **cargo:** Rust's package manager and build system. Extremely well-designed; considered the gold standard.

- **apt / brew:** System-level package managers for Linux and macOS respectively.

### Semantic Versioning

Package versions follow semantic versioning (semver): MAJOR.MINOR.PATCH. A MAJOR bump indicates breaking changes. A MINOR bump adds backward-compatible features. A PATCH bump fixes backward-compatible bugs. Understanding semver is essential for managing dependencies safely — upgrading a MAJOR version requires reviewing breaking changes.

### Lock Files

package-lock.json (npm), yarn.lock, and Cargo.lock record the exact version of every installed package, including transitive dependencies (dependencies of dependencies). Lock files ensure that running the same install command on a different machine installs identical package versions — reproducible builds. Lock files should be committed to version control.



## 14.3  Compilation and Transpilation

### Compiled Languages

For compiled languages (C, C++, Rust, Go), the build step produces machine code or an intermediate format. The output is a binary executable that can be run directly. Compilation checks type correctness, catches errors, and optimises the code.

### Transpilation

Transpilation converts source code in one high-level language to source code in another high-level language. TypeScript is transpiled to JavaScript. JSX is transpiled to standard JavaScript function calls. This allows developers to write in more expressive or safer languages while targeting runtimes that only understand the target language.

### Bundling

Web applications typically consist of many JavaScript files, CSS files, images, and other assets. A bundler (Vite, webpack, Rollup, esbuild) combines these into an optimised set of files for deployment. Bundling resolves import statements, eliminates dead code (tree shaking), and produces files that load efficiently in a browser.



## 14.4  Environments

### Why Multiple Environments Exist

A change to code should not go directly from a developer's machine to the system users are actively using. Multiple environments create a validation pipeline.

- **Development:** The developer's local machine. Debugging tools enabled, verbose logging, real or mocked external services. Optimisation not a priority.

- **Staging:** A production-like environment for testing before release. Same configuration as production, but not accessible to users. Where final validation happens.

- **Production:** The live system. Real users, real data, real consequences. Code that reaches production has passed all validation stages.

### Environment Variables

Configuration that changes between environments — API keys, database URLs, feature flags — is stored in environment variables, not in code. A .env file holds these values locally. Production environment variables are configured in the deployment platform. Code reads them at runtime through process.env (Node.js) or os.environ (Python).

Environment variables must never be committed to version control. Secrets in a repository — even briefly — should be treated as compromised.



## 14.5  Testing

### Why Tests Exist

Manual testing is slow, incomplete, and does not scale. Automated tests run in seconds, cover edge cases systematically, and run on every change. Tests are confidence — confidence that a change did not break existing functionality.

### Types of Tests

- **Unit tests:** Test individual functions or classes in isolation. Fast, numerous. Mock external dependencies. Test one thing.

- **Integration tests:** Test how multiple components work together. A test that calls a real database or makes a real network request.

- **End-to-end tests:** Test the complete application from the user's perspective. A browser automation test that clicks through the UI and verifies the result. Slow, valuable.

### Test-Driven Development (TDD)

Write the test before writing the code. The test fails (red). Write the minimal code to make it pass (green). Refactor. TDD produces well-tested code and encourages modular, testable design.



## 14.6  Continuous Integration and Continuous Deployment (CI/CD)

### Continuous Integration

CI is the practice of automatically building and testing code every time it is pushed to the repository. When a developer pushes a commit, a CI server (GitHub Actions, CircleCI, Jenkins) automatically runs the build and test suite. If any test fails, the developer is notified immediately. CI catches integration problems early, before they accumulate.

### Continuous Deployment

CD extends CI: if all tests pass, the code is automatically deployed to staging or production. CD requires high test coverage and confidence in the test suite — it is the practice of deploying frequently (multiple times per day in mature teams) and safely.

### GitHub Actions

GitHub Actions defines CI/CD pipelines as YAML files in the repository under .github/workflows/. A workflow triggers on events (push, pull request, schedule) and runs a sequence of steps: check out code, install dependencies, run tests, build, deploy. Secrets (API keys, deployment credentials) are stored in the repository's settings and injected as environment variables at runtime.



## 14.7  Version Control Workflow

Chapter 18 covers Git in depth. Here, the build process perspective: the workflow that connects version control to the build pipeline.

- **Feature branch:** Develop a feature on a separate branch. When complete, open a pull request.

- **Pull request:** A proposed merge. CI runs automatically. Team reviews the code. Discussion happens in comments.

- **Merge:** Once approved and CI passes, the branch is merged into main/master.

- **Deploy:** A merge to main triggers the deployment pipeline — build, test, deploy to production.



## 14.8  Deployment

Deployment is the process of making new code available to users. The specifics vary dramatically by target: deploying a web app, a mobile app, a microservice, and a desktop application are all different processes. The common thread: take what the build process produced and make it run in the target environment.

This chapter introduces the concept. Specific deployment platforms — Vercel, AWS, App Store Connect, Google Play — are covered in depth in Path 1's deployment block.




> **✅ EXIT CHECK — What you should be able to explain before moving on**

- ✓ What a package manager does and what a lock file is for
- ✓ The difference between compilation, transpilation, and bundling
- ✓ Why multiple environments (dev, staging, production) exist
- ✓ What environment variables are and why they must not be committed to version control
- ✓ The difference between unit, integration, and end-to-end tests
- ✓ What CI/CD is and what happens when a test fails in CI
- ✓ The feature branch → pull request → merge → deploy workflow


---


---



# Chapter 15 — The Terminal & Shells

*The developer's primary interface with the system*

## Overview

Every developer, regardless of path, eventually works in a terminal. Remote servers have no GUI. Automation requires scripting. Debugging tools, build systems, package managers, version control — all are primarily command-line tools. This chapter provides the foundation for comfortable, productive terminal use.



## 15.1  What the Terminal Is

A terminal emulator is a program that provides a text-based interface to the operating system. It runs a shell — the program that interprets typed commands — and displays the output. 'Terminal' and 'shell' are frequently used interchangeably in casual conversation, but they are distinct: the terminal is the window; the shell is the program running inside it.

Why command-line over GUI? Precision: commands are exact and unambiguous. Reproducibility: a sequence of commands can be saved as a script and run anywhere. Composability: command outputs can be piped into other commands. Remote access: SSH connects to a remote machine's terminal without any GUI.



## 15.2  Unix Shells

### Bash

The Bourne Again Shell (bash) is the default shell on most Linux distributions and was the macOS default until 2019. It is the shell of the internet: most server administration scripts and CI/CD configuration is written in bash. Reading and writing basic bash is an essential skill for any developer working with servers.

### Zsh

The Z shell (zsh) is now the default on macOS (since Catalina). It is largely compatible with bash but adds improved tab completion, better plugin support, and more configurable prompts. The Oh My Zsh framework adds themes and hundreds of plugins, making zsh the most common choice for developer workstations.

### Fish

The friendly interactive shell prioritises usability: autosuggestions from history, syntax highlighting, and better defaults out of the box without configuration. Not POSIX-compatible — bash scripts do not run in fish unchanged. Excellent for interactive use; limited for scripting.

### Shell Configuration Files

- **.bashrc / .bash_profile:** Executed when a new bash session starts. Contains aliases, function definitions, environment variable settings, and PATH modifications.

- **.zshrc:** The zsh equivalent. Loaded for every interactive zsh session.

- Changes to config files take effect in new terminal sessions. Run source ~/.zshrc to apply changes to the current session.

### The PATH Variable

PATH is an environment variable containing a colon-separated list of directories. When a command is typed, the shell searches each directory in PATH for an executable with that name. Adding a directory to PATH makes its executables available as commands. A common cause of 'command not found' errors is an installed tool's directory not being in PATH.



## 15.3  Windows Shells

### CMD (Command Prompt)

The original Windows command interpreter, descended from DOS. Supports basic file operations and batch scripting (.bat files). Its command syntax differs significantly from Unix shells. Still encountered in legacy scripts and some enterprise environments, but largely superseded by PowerShell.

### PowerShell

Microsoft's modern shell and scripting language. Unlike CMD, PowerShell works with .NET objects rather than plain text — commands produce structured objects that can be manipulated programmatically. Extremely powerful for Windows administration. PowerShell Core (PS 7+) is cross-platform — it runs on macOS and Linux. For developers working in .NET or Windows environments, PowerShell is essential.

### Windows Terminal

Microsoft's modern terminal emulator. Supports multiple tabs, each running a different shell (CMD, PowerShell, WSL, Azure Cloud Shell). Highly configurable. The recommended terminal for Windows developers.



## 15.4  Essential Commands — Unix

### Navigation

- **pwd:** Print working directory — shows the current location in the file system.

- **ls:** List files and directories. ls -la shows all files (including hidden) with permissions and sizes.

- **cd [path]:** Change directory. cd .. goes up one level. cd ~ goes to the home directory. cd - returns to the previous directory.

- **mkdir [name]:** Create a directory.

- **touch [file]:** Create an empty file (or update a file's timestamp if it exists).

### File Operations

- **cp [src] [dest]:** Copy a file. cp -r for directories.

- **mv [src] [dest]:** Move or rename a file.

- **rm [file]:** Delete a file. rm -rf deletes a directory and all its contents recursively. There is no undo — use with care.

- **cat [file]:** Print a file's contents to the terminal.

- **less [file]:** View a file page by page. q to quit. / to search.

- **head / tail:** Show the first or last lines of a file. tail -f follows a file as it grows — essential for monitoring log files.

### Searching

- **grep [pattern] [file]:** Search for lines matching a pattern. grep -r searches recursively through directories. grep -i is case-insensitive.

- **find [path] -name [pattern]:** Find files by name. find . -name '*.js' finds all JavaScript files in the current directory and below.

- **which [command]:** Show the path of an executable.

### Permissions

Unix permissions are expressed as three groups of rwx (read, write, execute) for the owner, group, and others: -rwxr-xr-- means the owner can read, write, and execute; the group can read and execute; others can only read.

- **chmod [permissions] [file]:** Change permissions. chmod 755 [file] sets rwxr-xr-x. chmod +x makes a file executable.

- **chown [user]:[group] [file]:** Change file owner.

- **sudo [command]:** Execute a command as the superuser. Prompts for password. 'Superuser do' — grants temporary root privileges.

### Piping and Redirection

The pipe operator | sends the output of one command as input to the next. ls -la | grep '.js' lists all files, then filters for lines containing '.js'. This composability — chaining simple tools together — is the Unix philosophy in practice.

- **>:** Redirect output to a file, overwriting it. ls > filelist.txt

- **>>:** Append output to a file. echo 'new line' >> log.txt

- **2>:** Redirect standard error. command 2> errors.txt

### Process Management

- **ps aux:** List all running processes.

- **top / htop:** Interactive process viewer showing CPU and memory usage.

- **kill [PID]:** Send a signal to a process. kill -9 [PID] forcibly terminates it.

- **Ctrl+C:** Send interrupt signal to the foreground process — stops it.

- **Ctrl+Z:** Suspend the foreground process. fg to resume it in the foreground, bg to continue it in the background.



## 15.5  Shell Scripting Basics

A shell script is a text file containing a sequence of shell commands. The first line (shebang) specifies the interpreter: #!/bin/bash or #!/usr/bin/env bash.

Shell scripts automate repetitive tasks: build pipelines, deployment steps, environment setup. Understanding the basics — variables, conditionals, loops, functions — enables reading and writing the scripts that appear throughout development infrastructure.




> **✅ EXIT CHECK — What you should be able to explain before moving on**

- ✓ The difference between a terminal and a shell
- ✓ The key differences between bash, zsh, and fish
- ✓ What the PATH variable is and why it matters
- ✓ The basic navigation and file operation commands
- ✓ What piping (|) does and why it is powerful
- ✓ What permissions are and how to read -rwxr-xr--
- ✓ The difference between stdout (1) and stderr (2)


---


---



# Chapter 16 — Terminal Text Editors

*Editing files without a graphical interface*

## Overview

When connected to a remote server via SSH, there is no file manager to drag and drop, no 'Open With' menu. The only way to edit a configuration file, fix a typo in a server script, or modify a systemd service definition is through a terminal text editor. Knowing at least one is a practical necessity.



## 16.1  Why Terminal Editors Exist

Terminal editors predate graphical interfaces. They emerged because the only interface available was a text terminal — a keyboard and a character display. The editor had to work within these constraints.

They remain relevant because: SSH sessions to servers provide only a terminal; graphical editors are not installed on servers (and should not be — they add attack surface and resource overhead); embedded systems and containers have no GUI; terminal editors are available on virtually every Unix-like system without installation.

The practical minimum: every developer should be able to open a file in nano, make a change, save it, and exit. The deeper investment: learning vim or neovim rewards users with exceptional speed and a tool that runs identically everywhere.



## 16.2  Nano

### What Nano Is

Nano is designed to be approachable. It behaves like a conventional editor: typing inserts characters; the arrow keys move the cursor; nothing requires mode-switching. The bottom of the screen shows available commands.

### Essential Nano Commands

- **nano [filename]:** Open a file (or create a new one).

- **Ctrl+O then Enter:** Save (Write Out) the file.

- **Ctrl+X:** Exit nano. If there are unsaved changes, prompts to save.

- **Ctrl+K:** Cut the current line.

- **Ctrl+U:** Paste the cut line.

- **Ctrl+W:** Search. Type the search term and press Enter.

- **Ctrl+G:** Open help.

The ^ in nano's documentation means Ctrl. ^X means Ctrl+X. This notation appears in many terminal contexts.

### When to Use Nano

For quick, infrequent edits on remote servers where only the system editor is available. For developers who need a terminal editor occasionally but do not want to invest in learning vim. For editing configuration files in a container or minimal environment.



## 16.3  Vim

### The Modal Editing Model

Vim's central concept — and the source of its reputation — is modal editing. Different modes enable different actions. Understanding modes is the key to unlocking vim.

- **Normal mode (default):** Every keystroke is a command, not a character insertion. h/j/k/l for left/down/up/right. w to move forward one word. b to move back one word. dd to delete the current line. yy to copy it. p to paste. This is where you spend most of your time.

- **Insert mode:** Typing inserts characters. Entered from normal mode by pressing i (insert before cursor), a (insert after cursor), o (open a new line below). Escaped back to normal mode with Esc.

- **Visual mode:** For selecting text. v for character-by-character selection, V for line selection, Ctrl+V for block selection.

- **Command mode:** Entered by pressing : in normal mode. For saving, quitting, search and replace, and other operations.

### The Minimum Viable Vim

To open, edit, save, and exit: vim [filename] opens a file in normal mode. Press i to enter insert mode. Edit the file. Press Esc to return to normal mode. Type :w to save (write). Type :q to quit. :wq saves and quits. :q! quits without saving (discards changes).

### Why People Learn Vim Deeply

Vim's commands are composable. An operator (d for delete, y for yank, c for change) combined with a motion (w for word, $ for end of line, G for end of file) performs the combined action: dw deletes to the end of the current word; d$ deletes to the end of the line; dG deletes from the cursor to the end of the file. This vocabulary approach means learning a small set of primitives enables a vast range of precise edits.

Vim is available on every Unix system without installation. An experienced vim user edits as fast as they think — the commands become muscle memory. Vim's keybindings are available as a mode in VS Code, JetBrains IDEs, and many other editors, meaning the investment transfers broadly.

### Neovim

Neovim is a refactored version of vim with a Lua configuration language, a modern plugin API, built-in LSP support (Language Server Protocol — the same system VS Code uses for code completion and error checking), and a large plugin ecosystem. Neovim can be configured into a full IDE. LazyVim and kickstart.nvim are popular starting configurations.

### When to Use Vim/Neovim

For developers who use a terminal extensively and want a single, highly capable editor available everywhere. For server administration. For anyone who wants to work without leaving the keyboard. Neovim specifically is increasingly popular as a primary development environment among experienced developers.



## 16.4  VS Code from the Terminal

For developers whose primary editor is VS Code, the terminal integration is essential: the code . command opens the current directory in VS Code. code [filename] opens a specific file. This command must be installed: in VS Code, open the command palette (Cmd+Shift+P on macOS), type 'shell command', and install 'code' in PATH.

VS Code's integrated terminal provides a terminal tab within the editor, making it unnecessary to switch between applications. The terminal opens in the project root. Multiple terminal instances can be opened simultaneously.




> **✅ EXIT CHECK — What you should be able to explain before moving on**

- ✓ Why terminal editors remain relevant in a world of graphical editors
- ✓ The minimum viable nano workflow: open, edit, save, exit
- ✓ What modal editing is and the three main vim modes
- ✓ The minimum viable vim workflow: open, enter insert mode, edit, save and exit
- ✓ What makes vim's command system powerful — the operator + motion composition model
- ✓ What neovim adds over vim
- ✓ How to open VS Code from the terminal


---


---



# Chapter 17 — Linux Distributions & WSL

*Understanding the Linux ecosystem and Windows-Linux integration*

## Overview

Linux is not a single operating system — it is a kernel around which many operating systems (distributions, or 'distros') have been built. Understanding what a distribution is, why so many exist, and how to navigate the major families is essential for any developer who interacts with servers, containers, or the open-source ecosystem.



## 17.1  What a Distribution Is

The Linux kernel is one component. A usable operating system also requires: system utilities (commands like ls, cp, grep), a package manager, system libraries, and typically a desktop environment and application software. A Linux distribution packages the kernel with these components and makes decisions about default configuration, security policies, and release cadence.

Different distributions make different tradeoffs: stability vs cutting-edge software, ease of use vs control, desktop experience vs server efficiency. This is why so many distributions exist — different use cases benefit from different tradeoffs.



## 17.2  The Major Families

### Debian-based Distributions

- **Debian:** One of the oldest distributions, known for extreme stability. The testing and unstable branches are more current. Debian is the foundation on which Ubuntu is built.

- **Ubuntu:** The most widely used Linux distribution. Built on Debian but with more current software and better out-of-box hardware support. Ubuntu LTS (Long Term Support) releases are supported for five years — the standard choice for servers. Ubuntu is what most cloud providers use as the default OS for virtual machines.

- **Linux Mint:** Ubuntu-based, designed to be immediately usable as a desktop. Ships with codecs, familiar UI patterns, and conservative defaults. Often recommended for users switching from Windows.

- **Package manager:** apt. sudo apt update updates the package list; sudo apt install [package] installs; sudo apt upgrade upgrades all installed packages.

### Arch-based Distributions

- **Arch Linux:** A DIY distribution. The installer is a command-line process; there is no graphical installer. The user builds the system from scratch — choosing every component. This is not a drawback; it is the point. Installing Arch forces a thorough understanding of how a Linux system fits together. Rolling release — packages are continuously updated rather than frozen at a major release.

- **Manjaro:** Arch-based but with a graphical installer, pre-configured desktop, and a brief delay before pushing Arch packages — smoothing over some of Arch's rough edges while retaining most of its advantages.

- **Package manager:** pacman. sudo pacman -S [package] installs; sudo pacman -Syu updates the system. AUR (Arch User Repository) provides community-maintained packages not in the official repository.

### Red Hat-based Distributions

- **Fedora:** Red Hat's upstream testing ground — features that will eventually appear in RHEL are tested in Fedora first. Cutting-edge software, short support cycle (~13 months per release). Good for desktop developers who want current software.

- **RHEL (Red Hat Enterprise Linux):** Enterprise-focused, extremely long support cycles (10+ years), paid subscription. The standard in large corporate and government environments.

- **Rocky Linux / AlmaLinux:** Free, community-maintained RHEL binary-compatible alternatives. Filled the gap left by CentOS's end-of-life. Used in environments that need RHEL compatibility without the subscription cost.

- **Package manager:** dnf (Fedora, RHEL 8+) or yum (older RHEL). sudo dnf install [package].

### Other Notable Distributions

- **NixOS:** Reproducible, declarative system configuration — the entire system is described in configuration files. Every installation is identical. Gaining developer interest.

- **Alpine Linux:** Extremely minimal — the base image is ~5MB. Security-focused. The standard base image for Docker containers.

- **Raspberry Pi OS:** Debian-based, optimised for the Raspberry Pi hardware. The default choice for hardware projects.



## 17.3  Choosing a Distribution

| Use Case | Recommended | Why |
|---|---|---|
| Cloud / server | Ubuntu LTS | Best support, most documentation, cloud default |
| Learning Linux deeply | Arch Linux | Forces understanding of every component |
| Desktop daily driver | Ubuntu or Mint | Polished, supported, familiar patterns |
| Hardware / Raspberry Pi | Raspberry Pi OS | Optimised for the hardware |
| Docker containers | Alpine Linux | Minimal footprint, security focus |
| Enterprise environment | RHEL / Rocky | Long support cycle, enterprise tools |



## 17.4  WSL — Windows Subsystem for Linux

### What WSL Is

WSL (Windows Subsystem for Linux) allows a Linux environment to run directly on Windows, without a virtual machine or dual boot. A Linux distribution (Ubuntu, Debian, Arch) runs as a process within Windows, providing a full Linux terminal environment. Files, processes, and network access all work as on a native Linux system.

### WSL 1 vs WSL 2

WSL 1 translated Linux system calls into Windows system calls — a translation layer approach. Fast for file system access in Windows directories, but not fully compatible with all Linux programs.

WSL 2 runs a real Linux kernel in a lightweight virtual machine. Full Linux binary compatibility. Docker Desktop uses WSL 2 as its backend on Windows. WSL 2 is slower than WSL 1 when accessing files in the Windows file system, but much faster for Linux file system operations. WSL 2 is the recommended version.

### Why Windows Developers Use WSL

Most server infrastructure runs Linux. Development tools — Docker, many CLI tools, build systems — are designed for Unix environments. Node.js, Python, and other runtimes behave more consistently on Linux than Windows. WSL allows a Windows developer to use Linux tools natively without leaving their Windows environment.

### File System Bridging

WSL can access Windows files at /mnt/c/ (for the C: drive). Windows can access WSL files via \\wsl$\Ubuntu\ in File Explorer. Performance is best when files are stored in the Linux file system and accessed from Linux tools — storing projects in /home/[user]/ rather than /mnt/c/ is recommended.

### VS Code and WSL

The VS Code Remote - WSL extension (built into VS Code by default) opens a VS Code window connected to the WSL environment. The editor runs on Windows; the language server, terminal, and file system access all run in Linux. This provides the best of both: Windows GUI with Linux tooling.

### WSL vs Dual Boot vs VM

- **WSL:** Best for developers who need Linux tools alongside Windows. No rebooting. Tight Windows integration. Some limitations for GUI applications and hardware access.

- **Dual boot:** Full native Linux performance. Requires rebooting to switch. Full hardware access.

- **Virtual machine:** Full Linux isolation. More overhead than WSL. Better for testing server configurations or running a complete different OS environment.




> **✅ EXIT CHECK — What you should be able to explain before moving on**

- ✓ What a Linux distribution is and how it relates to the kernel
- ✓ The three major distribution families and their package managers
- ✓ Why Ubuntu LTS is the standard choice for servers
- ✓ What makes Arch Linux valuable as a learning experience
- ✓ What WSL is and the key difference between WSL 1 and WSL 2
- ✓ Why Windows developers use WSL rather than dual booting
- ✓ The recommended approach for file storage in WSL for best performance


---


---



# Chapter 18 — Git & Version Control

*Tracking changes, collaborating, and shipping safely*

## Overview

Version control is the practice of tracking every change to a codebase — who made it, when, and why. Without version control, changes are irreversible, collaboration requires sharing files manually, and finding 'what changed last week when everything broke' is impossible. Git is the version control system used by virtually all professional software development.



## 18.1  The Problem Git Solves

Before version control, developers saved files with names like report_v2_FINAL_fixed_REAL.docx. This manual approach fails at team scale: two developers editing the same file produces conflicting versions. There is no way to see what changed between versions. Reverting a bad change requires manually undoing edits or restoring a backup.

Git solves all of these: it tracks every change as a snapshot (commit), stores who made each change and why (commit message), allows multiple developers to work independently on separate branches, and provides tools for merging their changes together.



## 18.2  Git vs GitHub

Git is a version control tool that runs on your computer. It manages the local history of a repository — a folder that git is tracking.

GitHub is a website (acquired by Microsoft in 2018) that hosts git repositories remotely. It adds collaboration features: pull requests, issue tracking, code review, wikis, and GitHub Actions for CI/CD. GitLab and Bitbucket are alternatives with similar features.

The relationship: git is the engine; GitHub is the garage where you park it and where the team meets.



## 18.3  Core Git Concepts

- **Repository (repo):** A directory tracked by git. Contains all the project files plus a hidden .git directory that stores git's data — the full history of every commit.

- **Commit:** A snapshot of the project at a specific moment. Each commit has a unique SHA-1 hash, an author, a timestamp, a commit message, and a reference to its parent commit(s). The commit history forms a directed acyclic graph.

- **Branch:** A named pointer to a commit. Creating a branch creates a parallel timeline — changes on a branch do not affect other branches. main (or master) is typically the production branch. Feature branches are created for individual features or bug fixes.

- **Remote:** A copy of the repository stored elsewhere — typically on GitHub. The default remote is named origin.

- **Clone:** Downloading a remote repository to create a local copy. git clone [url] creates the local copy, sets up origin, and checks out the default branch.

- **Working tree / Staging area / Repository:** Three distinct areas. The working tree is the actual files on disk. The staging area (index) is where changes are prepared for the next commit. The repository is the committed history.



## 18.4  The Daily Git Workflow

### Starting a Repository

- **git init:** Initialise a new git repository in the current directory. Creates the .git directory.

- **git clone [url]:** Clone an existing repository from a remote.

### Making Changes

- **git status:** Show what files have changed, what is staged, and what is untracked. Run this constantly — it is the compass.

- **git add [file]:** Stage a file for the next commit. git add . stages all changed files.

- **git commit -m 'message':** Create a commit with all staged changes. The message should describe what changed and why, not how. 'Fix null pointer in auth middleware' is good; 'fix stuff' is not.

- **git diff:** Show unstaged changes. git diff --staged shows staged changes.

### Working with Remotes

- **git push:** Upload local commits to the remote. git push origin main pushes the main branch to origin.

- **git pull:** Fetch and merge changes from the remote. git pull is git fetch + git merge.

- **git fetch:** Download remote changes without merging them. Lets you inspect what changed before integrating.

### Inspecting History

- **git log:** Show the commit history. git log --oneline gives a compact view. git log --graph shows branch structure visually.

- **git show [hash]:** Show the diff introduced by a specific commit.

- **git blame [file]:** Show which commit last modified each line of a file. Useful for understanding the history of a specific piece of code.



## 18.5  Branching

### Creating and Switching Branches

- **git branch [name]:** Create a new branch at the current commit.

- **git switch [name]:** Switch to a branch. git switch -c [name] creates and switches in one step. (Older: git checkout -b [name].)

### Merging

Merging integrates the changes from one branch into another. When a feature branch is ready, it is merged into main.

- **Fast-forward merge:** When the target branch has not diverged — the feature branch is simply ahead — git moves the branch pointer forward. No merge commit created.

- **Three-way merge:** When both branches have new commits, git creates a merge commit combining both histories.

### Rebasing

An alternative to merging: rebase replays the commits from one branch on top of another. The result is a linear history without merge commits. Rebasing rewrites commit hashes — never rebase commits that have been pushed to a shared remote, as this creates conflicts for other developers.



## 18.6  Resolving Conflicts

A merge conflict occurs when two branches have modified the same part of the same file in different ways. Git cannot automatically determine which version to keep.

When a conflict occurs, git marks the conflicting sections in the file:

<<<<<<< HEAD contains the current branch's version. ======= separates the two. >>>>>>> feature-branch contains the incoming branch's version. The developer edits the file to the desired final state, removes the conflict markers, stages the file, and completes the merge with git commit.

VS Code, JetBrains IDEs, and GitHub's web interface provide visual conflict resolution tools.



## 18.7  GitHub Features

- **Pull Request (PR):** A proposal to merge a branch into another. GitHub shows the diff, allows comments on specific lines, tracks the discussion, and requires approvals before merging. The primary collaboration mechanism in professional development.

- **Issues:** Track bugs, feature requests, and tasks. Can be linked to pull requests and commits.

- **GitHub Actions:** CI/CD pipelines defined in YAML files. Triggered by events (push, PR, schedule). Covered in Chapter 14.

- **Forks:** A personal copy of another user's repository on GitHub. Changes are made in the fork and proposed back to the original via a pull request. The standard contribution model for open-source software.

- **GitHub Copilot:** AI code completion integrated into editors, trained on public GitHub repositories.



## 18.8  The .gitignore File

The .gitignore file specifies patterns of files that git should not track. Any file matching these patterns is ignored — it will not appear in git status, will not be staged, and will not be committed.

Every project should have a .gitignore. Always ignore: node_modules/ (installed dependencies, large, reproducible), .env (environment variables and secrets), *.log (log files), dist/ or build/ (build output), .DS_Store (macOS metadata files), *.pyc (Python bytecode).

GitHub's repository creation wizard offers pre-generated .gitignore templates for common languages and frameworks.




> **✅ EXIT CHECK — What you should be able to explain before moving on**

- ✓ The difference between git and GitHub
- ✓ What a commit is — a snapshot, not a diff
- ✓ The three areas: working tree, staging area, repository
- ✓ The full workflow: status → add → commit → push
- ✓ What a branch is and why feature branches exist
- ✓ What a merge conflict is and how to resolve one
- ✓ What a pull request is and why it is the primary collaboration mechanism
- ✓ What .gitignore is for and what should always be ignored


---


---



# Chapter 19 — Docker & Containers

*Packaging software with its environment*

## Overview

'It works on my machine' is one of the most common phrases in software development — and one of the most damaging. Code that works in development fails in production because the environments differ: different OS versions, different library versions, different configurations. Docker solves this by making the environment part of the code.



## 19.1  The Problem Docker Solves

### Environment Drift

A typical development environment accumulates state over time: installed tools, configured environment variables, libraries at specific versions, OS patches. Production servers have different versions of everything. Staging servers differ from both. New team members spend days setting up their machines to match the team's configuration.

### The Container Solution

A container packages an application together with all of its dependencies — the exact OS libraries, runtime versions, and configuration files — into a single, self-contained unit. The container runs identically on a developer's laptop, a CI server, and a production VM. The environment is specified in code (the Dockerfile) and versioned in the repository.



## 19.2  Containers vs Virtual Machines

### What a VM Provides

A virtual machine emulates complete hardware. It runs a full guest OS kernel. A VM image might be 10–20GB. Starting a VM takes 30–60 seconds. Each VM consumes significant RAM for its own OS overhead.

### What a Container Provides

A container shares the host OS kernel. It isolates only the application's user-space environment — the file system, processes, network interfaces, and mount points. A container image might be 50–200MB. Starting a container takes under a second. Containers are an order of magnitude more lightweight than VMs.

### The Tradeoff

VMs provide stronger isolation — a security breach in one VM does not directly affect others because they have separate kernels. Containers share the host kernel; a kernel vulnerability could potentially affect all containers. For most applications, containers provide sufficient isolation with much better efficiency. For multi-tenant systems handling untrusted code, VMs or security-hardened containers are preferred.



## 19.3  The Docker Architecture

- **Docker daemon:** The background process that manages containers and images. Runs as a system service.

- **Docker client:** The docker CLI command that sends instructions to the daemon.

- **Image:** A read-only template for creating containers. An image consists of layers — each instruction in the Dockerfile adds a layer. Layers are shared and cached, making image distribution efficient.

- **Container:** A running instance of an image. Containers are writable — changes made inside a running container (unless written to a volume) are discarded when the container is removed.

- **Registry:** A storage and distribution system for images. Docker Hub is the public default. GitHub Container Registry (ghcr.io), AWS ECR, and Google Container Registry are alternatives.



## 19.4  The Dockerfile

A Dockerfile is a text file containing instructions for building a Docker image. Each instruction creates a new layer.

- **FROM [base-image]:** Every Dockerfile starts with a base image. FROM node:20-alpine starts from an Alpine Linux image with Node.js 20 pre-installed. FROM python:3.12-slim provides a minimal Python environment.

- **WORKDIR [path]:** Set the working directory inside the container for subsequent instructions.

- **COPY [src] [dest]:** Copy files from the build context (the local directory) into the image.

- **RUN [command]:** Execute a command during the build. Used for installing packages, compiling code, creating directories.

- **ENV [key]=[value]:** Set environment variables in the image.

- **EXPOSE [port]:** Document which port the container listens on. Does not actually publish the port — that is done at runtime.

- **CMD [command]:** The default command to run when a container starts. Can be overridden at runtime. ENTRYPOINT is similar but less easily overridden.

### Layer Caching

Docker caches each layer. If a layer has not changed since the last build, Docker uses the cached version. Layers that change frequently (COPY . . to copy source code) should come after layers that change infrequently (RUN npm install). Putting package.json copy and npm install before the full source copy means dependency installation is only re-run when package.json changes, not on every code change.



## 19.5  Essential Docker Commands

- **docker build -t [name]:[tag] .:** Build an image from the Dockerfile in the current directory. -t gives it a name and optional tag.

- **docker run [image]:** Create and start a container from an image. -p [host-port]:[container-port] publishes a port. -d runs in detached (background) mode. --name gives the container a name. -e KEY=VALUE sets environment variables.

- **docker ps:** List running containers. docker ps -a includes stopped containers.

- **docker stop [container]:** Gracefully stop a running container. docker kill sends SIGKILL immediately.

- **docker rm [container]:** Remove a stopped container.

- **docker rmi [image]:** Remove an image.

- **docker logs [container]:** Show a container's output. -f follows the log stream in real time.

- **docker exec -it [container] bash:** Open an interactive shell inside a running container. -it attaches an interactive terminal.

- **docker pull [image]:** Download an image from a registry.

- **docker push [image]:** Upload an image to a registry (requires authentication).



## 19.6  Docker Compose

### What Docker Compose Solves

Real applications typically involve multiple containers: a web application server, a database, a cache, a background worker. Running each individually with docker run requires remembering many flags and ensures containers are started in the right order. Docker Compose defines all services in a single YAML file and manages them together.

### The docker-compose.yml

A Compose file defines services (containers), their images or build context, published ports, environment variables, volumes, and dependencies. docker compose up starts all services. docker compose down stops and removes them. docker compose logs [service] shows logs. docker compose exec [service] [command] runs a command in a running service.

### Volumes

By default, data written inside a container is lost when the container is removed. Volumes mount a directory from the host (or a named volume managed by Docker) into the container, persisting data across container restarts. Database containers (Postgres, MySQL, Redis) must use volumes to persist their data.



## 19.7  Docker in Practice

### In Development

Docker Compose creates a consistent development environment that every team member runs identically. A new developer runs docker compose up and has the entire stack running — web server, database, and any other services — without installing anything except Docker. This eliminates 'works on my machine' for the development environment.

### In CI/CD

CI pipelines build Docker images, run tests inside containers, and push the built image to a registry. This ensures the tested artifact is identical to what will be deployed.

### In Production

The built image is deployed to production — on a single VM (docker run), across multiple VMs (Docker Compose or Docker Swarm), or in a Kubernetes cluster. The container running in production is the same image that was tested in CI.

### Kubernetes

Kubernetes (k8s) is an orchestration system for deploying, scaling, and managing containers across a cluster of machines. It handles automatic scaling, self-healing (restarting failed containers), rolling updates, and load balancing. Kubernetes is the standard for large-scale container deployments. It is a large, complex system — worth being aware of as the destination Docker expertise leads toward, but not in scope for this chapter.




> **✅ EXIT CHECK — What you should be able to explain before moving on**

- ✓ What problem Docker solves — 'it works on my machine' and environment drift
- ✓ The difference between a VM and a container
- ✓ What a Docker image is vs a container
- ✓ The key Dockerfile instructions: FROM, COPY, RUN, CMD
- ✓ What layer caching is and how to structure a Dockerfile to take advantage of it
- ✓ What Docker Compose solves and the key commands
- ✓ What a volume is and why database containers require them
- ✓ How Docker fits into a CI/CD pipeline
