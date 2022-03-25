export const getTokenLogos = () => {
	return ({ 
		USDT: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAADAFBMVEVHcEwA/wAmoXsAAAAAf38loHoAolUA//8moXomoHoAqqpVqqoloXomoXo/v38loXsAf38moHoloHomoHsloXsmoXomoXkloHolonslonkmoHsmo3wmn3kkoXs/f38mpH0mo3wloXsloXsloHkmonslonsmo30npX0mn3omo30lnXknp38moXwloHompH0non0moXsmoXkloXsmoXolonsloXsAAEcno34mpX0mpX4loHoloXwmo30mm3kAAP8ln3ompX4moHoknXkloXsknXcinHkloXsnpH0monsmoXsno30onnomoXsmo30moHomonomoXszmWYmoHoAmWYmoHompX4mpH4mpH0non0ko3YkmnYmoHomoXv///8pon39/v4oonwYm3P8/v0noXx3xKz+//4joHkin3nu+PUprYQloHrZ7uja7+k3qIUmonwoqIAbnHQop4Ano30VmnEoqYEprIMnoXsZm3MkoHononwcnXUXm3IproUprIQloXoanHT8/f0gn3gmo3wUmXAfnncennYproQoqoHY7ugdnXYhn3ggnnf5/PyJzLcXmnIro34pq4MnpH1Zt5r+/v4np38npX4npn8loXsin3jt+PT7/fz2+/o+rIrf8eszp4SU0b4spH9BrYwoq4IorIO239JauJu139Inp4BbuJt1xKwenXbK6N8loHvh8u1NspNxwahzw6o5qYfq9vM4qYZJsJCGy7WDyrQ2qIV7xq+74dZMsZKMzbkoon3S6+TU7OXb7+lPs5WOzronqIBnvaJvwaji8u4upYBUtpjd8Os2qIQpo307qoiu3M5nvaP1+/kqo32Nzbry+feV0b+/49gpon5kvKFRtJWPz7tqv6WT0L5ovqREro1twKd5xa4vpYBywqkypoJHsJCAyLKT0L0pq4LZ7+ic1MP9/v3a7+jX7uf5/ft4xK2Qz7t+x7Aponyz3tHk8+9gup6Z08HO6eHH593v+PYmoXzs9/Sr2sy44NSi18YAjmDx+fbD5dqn2coAkGT9IPnsAAAAXHRSTlMAAf4BAvsDAf3+AwP79wT6BP2Q/F26YvztFv6OKCkE9Ybqjvut+vz9a/4X/nfY00HVP9H4qagCbef0h4+nLgGOv/sVxGAsx+vv/OoZeHjq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',
		USDC: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAADQ0lEQVR4XtXZMW4UQRCFYY7AEZyZC3ABTsAFOAEJiSVHhKQEJISkXAGRI5AQQrLkAAmRmBCcEBAZjYVX8rdV3bUzs7PjX/qTfa97unqN2LXv3VuI45OPP45PPl0VvXT9nSMYapLuv1o8+Nz6vFWw44/3XK7jn0lwsEX1PIvhQQ6t59srPnwtes7Z8YFr1XPPgg9Zu55/Em6+q6dvv2+91vPxy7Orh88/b72+i84xCjetKuY9xbyq8+yEm1XMsNczw15F5yrjRi3fn/32rLew37PF+c8/W/2WzlXCTVr2sF+1h/2WztfExS1b2B1rC7stnTPFhZkZ9uYyw16mc4a4KDPDXqaYZ2bYy3TeW1S/1WXYaynmLTPsZTr3BouRGfZ6innPDHuRzr3BYmSEnYpiXjHCTuTRsy/3nX3R4aO9zKtG2Il0/lEXYN6ziut6innk5OEH7GSOwT1aRtiJnHQB5i3H4j4txTyyfAERdjIj7GTdJ6/PtzqZEXZ09AWYtxRzFfOWYq7/h+9/+BHzzOEdFDsq5i3FPLL77j998819tzqZr95duHSrM6cyfEW3o90LEPOeYj63Yq6LX8AN9uZSzPVgFxDh2jGKue79AqI9KrhHVTHXRS4g26uH6yuKuS56ATcOv/Ov4tqeYq4HuYDIi19/fdQ19nqKua7mAm6MsNNSzHV1FxD9fcFOSzHX4QIufVHFPFPMM8U8U8wj9/plSMwjI+xkirnu/dtghB0V85ZirqMvYMBOZoSdMV2NsKPlCxgU88xd/s8X92op5pGbC6hcQoSdlrvi+pYRdvTW8JULGBTznhVcU1HMI53/GksaYaeqmFeNsKMPTj8cOfs1FiMj7FQU84oRdiKde8Nx4UPRYISdnmLeM8JOpnPfwnJkhr2WYt4yw16k84a4KDLD3txm2IsM/yga4cLMFnan2sJupnM2cXFmD/u72sN+pvOVcJOWPez37PHoxdetNZnOVcaNeraw27OF3Z7OtRNuVjHCTs8IOxWdZxRuWnXK4aesvdE5JuHma9fzz4IPWauee3Z84Fr0nHvFhx9az7cYHmRpyx9v94mHWkrPcXCGd8NDzm36y4y14cGn6v53Dgfq6fp98Q/twpmau6HU4QAAAABJRU5ErkJggg==',
		BUSD: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAADnElEQVR4XtVbTW6cMBTOsoFGyjXaE7Sr9gbNDdob5Cg9RA8wu4aZLlC7yDVIpXYNMyNF6kSZlGdgQj5jsM17GD7pU6KxDX7+3o8xM2dnEyBfXV7mN68/btfx12IdrYp1nBWbOC//PilW/2fURn2oL43B6ywG2835dWlUejJwLJM43a3jz3if2YGUYzVcY7TKv19c4X2D44U7T8Yow3lMDqW4il2c3FSMsiChkd/EX8KobuKEC0HZWZ/APCheOealuolCuUG5vXazeZI9HPAGSyHa4QVJ5Xe/3j7tb99rn3NxtCcUgiWOjG8guQglc7TLCpLZnox/vP99WoDjoRBdBOfqIO32JkguglM4FEKuj8ojhD3BLhSk1O9THoFjuUhbd7RXQyGg/pDybRwfcm08Hwc2SYWQ8bbY377TxgvQHAodnUeRQ3m6Bn42lmi3Qr6+uMKOY8ih/HM7b2LszAX1WZ3W2Yccyh/+fnvuw10dkjh9YTxn5udUHsG5CNvk/Pq0AFzneNzKI1g9oe0FWqMHJZVH7H6+0cb6kHUBiDbwUR6BY32pjM9T3oeewx+zIWOV/1deG8eOoXpIqk92tcYx7MKclG+oymH1ukpvHGIT85SYsI3Y9gQp5Y8PhWr3TYxku1f9x2xvmgBBSnm6ZwPv6pBEK+f9vynbmzyhi7YYUh7hvgjlw5HLUTcqj7CZAKfyCA9PyK1LoEl5RJ8n2MJVeYTLIlgvQN/KtzFFzA/BZaPkFAI0iT4VpLP9EB7v75yML+oQyDoajDQpsTTlK1IS9CiD6AkLVL4ilUHfjVCjzDKVr6g2QlNthbsQTPma+82rD/wPQwtQvuHpjRE2+NIWoZVvyHoeYLtRIuBY4pTKN3xeAKYjMawOiLkor9g+ElNfbMQOnuxTEvsO9UewGV9Se1nK5QVE9IRZKU+k+o/gLodtZbEN24fAanzJ3Y/oE9qvgB3H0jTxYMrXRLtPcHkw8mVI5SsGeEPcMLTyg8YTuHNBm7aQMb4j85sgFQpYHRByyhMt1G/A+bIU2ZcD5Ix3UL8B90NSm+gJssp7fE2ugVQoENueIGm8k+t3QTocJI13dnsT8MJLIdoxCpKewE025RGF4CaJjZuer8FxQLI6jKV3tndFHQ4ZTiAYS9XF3L4P4RciytTJbmgUIRZBOtZ9QAcNPm+arJnE6SwUH0L9w8pUM8CXpeF0bon3WQwoO5Ny28Ti5/NlH+o7VUb/D95+oUC15sWYAAAAAElFTkSuQmCC',
		DAI: 'data:image/png;base64,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',
	});
}