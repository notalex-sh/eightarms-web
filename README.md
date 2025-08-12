```
         ______
        /      \ 
       /        \ 
       |        |
    )  o        o   ?        EightArms Web
   (    \      /    |        GitHub Email Intelligence
     \__/||||||\___/ _
   \____/ |||| \____/ `
   ,-.___/ || \__,-._
  /    ___/  \__
     _/         `--
```

> This application is currently in *DEMO* mode. It requires a password for use.

A web-based interface for the powerful [**EightArms**](https://github.com/notalex-sh/eightarms) OSINT tool, which extracts publicly available email addresses from GitHub repositories through commit history analysis.

This web application enables security researchers and investigators to gather intelligence on a target's digital footprint while maintaining operational anonymity.

## Overview & Theory

EightArms performs automated reconnaissance on GitHub user accounts by analyzing publicly accessible commit metadata across their repository ecosystem. The tool extracts email addresses from commit headers, signatures, and collaboration records without requiring authentication or leaving direct forensic traces.

The core methodology is based on the principles outlined in the my blog post:
- **[My GitHub OSINT Blog](https://www.notalex.sh/blog/githubosint)**

This is a web rendition of the original EightArms CLI tool:
- **[EightArms CLI](https://github.com/notalex-sh/eightarms)**

## Key Capabilities

- **Web-Based Reconnaissance**: A simple UI to run scans without command-line interaction.
- **Configurable Scans**: Adjust scan intensity with `Fast`, `Medium`, and `Slow` profiles, or use custom settings for repository and commit analysis depth.
- **Anonymity Preservation**: Operates through standard, unauthenticated HTTP requests with randomized headers to mimic normal browser traffic.
- **Aggregated Intelligence**: Discovered emails are de-duplicated, counted, and presented with their source repositories to map a target's operational circles.
- **Secure Access**: The web interface is password-protected.

## How It Works

The tool operates through a structured reconnaissance methodology:

1.  **Target Enumeration**: Identifies public repositories associated with the target username.
2.  **Commit History Analysis**: Systematically retrieves commit metadata from repository timelines.
3.  **Patch Acquisition**: Downloads commit patches containing author and contributor information.
4.  **Email Extraction**: Parses commit headers (`Author`, `Committer`, `Signed-off-by`) using pattern matching.
5.  **Intelligence Compilation**: Consolidates unique email addresses, providing a clear view of the target's collaborators and associated email accounts.
