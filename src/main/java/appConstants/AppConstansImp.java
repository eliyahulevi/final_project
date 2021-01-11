package appConstants;

public class AppConstansImp implements AppConstants{

	@Override
	public String Get_userName() {

		return AppConstants.userName;
	}

	@Override
	public String Get_password() {

		return AppConstants.password;
	}

	@Override
	public String Get_dbName() {

		return AppConstants.dbName;
	}

	@Override
	public String Get_driverURL() {

		return AppConstants.driverURL;
	}

	@Override
	public String Get_dbURL() {
		return AppConstants.dbURL;
	}

}
