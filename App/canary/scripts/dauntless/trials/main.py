import requests
import json
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


# Obtains an access token for Dauntless using an authorization code.
def get_access_token_dauntless(authorization_code):
    try:
        url = "https://account-public-service-prod.ol.epicgames.com/account/api/oauth/token"
        headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": f"Basic {os.getenv('DAUNTLESS_AUTHORIZATION')}",
        }
        data = {"grant_type": "authorization_code", "code": authorization_code}
        response = requests.post(url, headers=headers, data=data)
        response.raise_for_status()
        data = response.json()
        # print("Dauntless Access token")
        # print(data)
        return data["access_token"]
    except requests.exceptions.RequestException as e:
        print(f"Error in get_access_token_dauntless: {e}")
        return None
    except KeyError:
        print("Access token not found in response.")
        return None


# Create an exchange code using the Dauntless access token.
def create_exchange_code(access_token):
    try:
        url = "https://account-public-service-prod.ol.epicgames.com/account/api/oauth/exchange"
        headers = {"Authorization": f"Bearer {access_token}"}
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        data = response.json()
        # print("Exchange Code")
        # print(data)
        return data["code"]
    except requests.exceptions.RequestException as e:
        print(f"Error in create_exchange_code: {e}")
        return None
    except KeyError:
        print("Exchange code not found in response.")
        return None


# Obtain a new access token using an exchange code.
def get_access_token(exchange_code):
    try:
        url = "https://api.epicgames.dev/epic/oauth/v2/token"
        headers = {
            "Accept-Encoding": "deflate, gzip",
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json",
            "Authorization": f"Basic {os.getenv('EPIC_AUTHORIZATION')}",
            "X-Epic-Correlation-ID": os.getenv("EPIC_CORRELATION_ID"),
            "User-Agent": os.getenv("EPIC_USER_AGENT"),
            "X-EOS-Version": os.getenv("EPIC_VERSION"),
        }
        data = {"grant_type": "exchange_code", "exchange_code": exchange_code}
        response = requests.post(url, headers=headers, data=data)
        response.raise_for_status()
        data = response.json()
        # print("Trials token")
        # print(data)
        return data["access_token"]
    except requests.exceptions.RequestException as e:
        print(f"Error in get_access_token: {e}")
        return None
    except KeyError:
        print("Access token not found in response.")
        return None


# Obtains a session token using the Trials token.
def get_session_token(trials_token):
    try:
        url = "https://gamesession-prod.steelyard.ca/gamesession/epiceos"
        headers = {
            "Accept": "*/*",
            "Accept-Encoding": "deflate, gzip",
            "Authorization": f"BEARER {trials_token}",
            "Content-Type": "application/json; charset=utf-8",
            "X-Archon-Console": "(Windows)",
            "User-Agent": os.getenv("USER_AGENT"),
        }
        response = requests.put(url, headers=headers)
        response.raise_for_status()
        data = response.json()
        # print("Session Token")
        # print(data)
        return data["payload"]["sessiontoken"]
    except requests.exceptions.RequestException as e:
        print(f"Error in get_session_token: {e}")
        return None
    except KeyError:
        print("Session token not found in response.")
        return None


# Gets the leaderboards for a specific trial.
def get_leaderboards(session_token, trial_id):
    try:
        url = "https://leaderboards-prod.steelyard.ca/trials/leaderboards/solo"
        # url = "https://leaderboards-prod.steelyard.ca/trials/leaderboards/group"
        headers = {
            "Accept": "*/*",
            "Accept-Encoding": "deflate, gzip",
            "Authorization": f"BEARER {session_token}",
            "Content-Type": "application/json; charset=utf-8",
            "X-Archon-Console": "(Windows)",
            "User-Agent": os.getenv("USER_AGENT"),
        }
        data = {
            "difficulty": 1,
            "page": 0,
            "page_size": 100,
            "trial_id": trial_id,
            # "trial_id": "Arena_MatchmakerHunt_Elite_185",
            # "trial_id": "Arena_MatchmakerHunt_Elite_New_0104",
            "target_platforms": [],
        }  # Put your JSON data here if needed
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error in get_leaderboards: {e}")
        return None


if __name__ == "__main__":
    # Load authorization code from environment variables
    authorization_code = os.getenv("AUTHORIZATION_CODE")
    if not authorization_code:
        print("Authorization code is required.")
        exit(1)
    access_token_dauntless = get_access_token_dauntless(authorization_code)
    if not access_token_dauntless:
        print("Failed to obtain Dauntless access token.")
        exit(1)
    exchange_code = create_exchange_code(access_token_dauntless)
    if not exchange_code:
        print("Failed to obtain exchange code.")
        exit(1)
    access_token = get_access_token(exchange_code)
    if not access_token:
        print("Failed to obtain access token.")
        exit(1)
    session_token = get_session_token(access_token)
    if not session_token:
        print("Failed to obtain session token.")
        exit(1)

    # Gets the leaderboards for a specific week.
    # leaderboards = get_leaderboards(session_token)
    # if leaderboards:
    #     with open(f"leaderboards.json", "w") as outfile:
    #         json.dump(leaderboards, outfile, indent=4)
    #     print(f"Output saved to leaderboards.json")
    # else:
    #     print(f"Failed to obtain the leaderboards.")

    # Gets the leaderboards for a specific week.
    for week in range(1, 108):  # Iterates from week 1 to 107
        trial_id = f"Arena_MatchmakerHunt_Elite_{week:03d}"
        leaderboards = get_leaderboards(session_token, trial_id)
        if leaderboards:
            with open(f"week{week}.json", "w") as outfile:
                json.dump(leaderboards, outfile, indent=4)
            print(f"Output saved to week{week}.json")
        else:
            print(f"Failed to obtain leaderboards for week {week}.")
