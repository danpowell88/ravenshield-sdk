# Ravenshield SDK2

This repository is based on the Ravenshield SDK2 by Twi and currently utilizes the 1.60 SDK files.

## Getting Started

### Prerequisites

- Node.js installed on your system
- npm (Node Package Manager)

### Installation and Setup

1. Clone the repository:
    ```bash
    git clone <repository-url>
    cd SDK2
    ```

2. Create a `projects` directory in the root of the cloned repository:
    ```bash
    mkdir projects
    ```

3. Copy your project into the `projects` directory. The folder structure should look like:
    ```
    projects/<projectName>/classes
    ```

## Compiling a Project

To compile your project, run the following command:

```bash
npm run compile <projectName> <projectLocation> <strip>
```

- `<projectName>`: Name of your project folder.
- `<projectLocation>`: Path to your project relative to the `projects` directory.
- `<strip>`: Set to `true` or `false`. Determines whether to run the UCC strip command, which reduces file sizes.

### Example

```bash
npm run compile MyProject ./projects/MyProject true
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.