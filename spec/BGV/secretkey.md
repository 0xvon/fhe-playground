## Generating Secret Key

This section explains how this scheme generates secret key $SK$.

#### Preliminaries

- $R_2$: key distribution used to sample polynomials with integer coefficients in $\{ -1,0,+1 \}$

#### Key Generation

The secret key $SK$ is generated as a random ternary polynomial from $R_2$, a polynomial degree $n$ with coefficients in $\{ -1,0,+1 \}$.